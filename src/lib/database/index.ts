import {AsyncResultCallback,retry} from 'async'
import * as path from 'path'
import {knex, Knex} from 'knex'


export interface Configuration {
    host: string
    port: number
    user: string
    password: string
    database: string
    debug: boolean
}

export class MySql {
    private config: Configuration
    private connection: Knex | undefined
    private retryDbConnectionPromise: Promise<Knex> | undefined

    constructor(config: Configuration) {
        this.config = config
    }

    public async getConnection(): Promise<Knex> {
        if (!this.connection) {
            this.connection = await this.retryDbConnection();
        }
        return this.connection;
    }


    public async getTransaction(): Promise<Knex.Transaction> {
        const connection = await this.getConnection();
        return new Promise<Knex.Transaction>((resolve, reject) => {
            try {
                connection.transaction((trx: Knex.Transaction) => {
                    resolve(trx)
                })
            } catch (err) {
                reject(err);
            }

        })
    }

    public async closeDatabase(): Promise<void> {
        if (this.connection) {
            await this.connection.destroy();
            this.connection = undefined
        }

    }

    public async schemaMigration() {
        const connection = await this.getConnection();
        await connection.migrate.latest(
            {
                directory: path.resolve(__dirname, './migrations')
            })
    }

    public async createConnection(): Promise<Knex> {
        const config: Knex.Config = {
            client: 'mysql',
            connection: {
                host: this.config.host,
                port: this.config.port,
                user: this.config.user,
                password: this.config.password,
                database: this.config.database
            },
            pool: {
                min: 0, max: 10,
                createTimeoutMillis: 3000,
                acquireTimeoutMillis: 30000,
                idleTimeoutMillis: 30000,
                reapIntervalMillis: 1000,
                createRetryIntervalMillis: 100,
                propagateCreateError: false // <- default is true, set to fal
            },
            debug: this.config.debug,
            migrations: {
                tableName: 'migrations'
            }
        }
        const db: Knex = knex(config)

        //await db.raw('select 1');

        return db;
    }

    private retryDbConnection(): Promise<Knex> {
        if (this.retryDbConnectionPromise instanceof Promise) {
            return this.retryDbConnectionPromise;
        }
        const methodToRetry = (cb: AsyncResultCallback<Knex, Error>) => {
            this.createConnection().then((db: Knex) => {
                cb(undefined, db);
            }).catch((err: Error) => {
                cb(err, undefined)
            })

        }
        this.retryDbConnectionPromise = new Promise<Knex>((resolve, reject) => {
            retry({
                times: 3, interval: 1000
            }, methodToRetry, (err: Error | undefined, db: Knex) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(db);
                }
                this.retryDbConnectionPromise = undefined;
            })
        })
        return this.retryDbConnectionPromise;
    }


}
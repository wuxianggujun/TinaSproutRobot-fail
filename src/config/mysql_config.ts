import { Knex } from 'knex';
import {Configuration, MySql} from '../lib/database'

const MysqlConfig: Configuration = {
    database: 'botdata',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    debug: false
}

export const database: MySql = new MySql(MysqlConfig);
export const connection:Promise<Knex> = database.getConnection();

export async function truncateTables(tables: string[]) {
    const conn = await database.getConnection()

    for (const table of tables) {
        await conn.raw(`DELETE FROM ${table}`)
    }
}

async function test() {
    const test = await connection;
        //database.getConnection();
    const content = await test.select().from('group_table').timeout(1000)
    //console.log(JSON.stringify(content));
    console.log(content);
}

test();

// (async ()=>{
//     await connection;
// })();
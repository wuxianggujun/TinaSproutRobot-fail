const setting = require("../config/setting")
import * as mysql from 'mysql';

class MySqlConn {

    createPool(): void {
        const pool = mysql.createPool(setting.mysql)
    }


}

module.exports = {
    MySqlConn() {
        return new MySqlConn()
    }
}


export function db(sql: string, args: any[]) {
    const config = mysql.createPool(setting.mysql)
    return new Promise<any>((resolve, reject) => {
        config.getConnection((err, conn) => {
            if (err) {
                throw err;
            }
            conn.query(sql, args, (err1, results, fields) => {
                conn.release()
                resolve({err: err1, results: results, fields: fields})
            })
        })
    })
}

import mysql from "mysql";
require('dotenv').config();

const connection = mysql.createPool({
    host     : process.env.DB_HOST,
    port     : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
});

export class Query 
{

    constructor(rawQueryString = null) 
    {
        this.rawQueryString = rawQueryString;
        this.queryLoader = [];
    }
    
    setTableName(tableName)
    {
        this.tableName = tableName;
        return this;
    }

    where(column, operator = '=', value)
    {
        this.queryLoader.push({command: "WHERE", column, operator, value});
        return this;
    }

    async get() 
    {
        this.query = `SELECT * FROM ${this.tableName}`;
        this.buildQuery();
        return this.runQuery()
                .then(res => { return res })
                .catch(err => { return err });        
    }

    /**
     * @param {Entity} data 
     */
    async insert(data)
    {
        this.query = `INSERT into ${this.tableName} (`;
        for (let d in data) {
            if (d != 'table' && data[d] != null)
                this.query += `${d}, `;
        }
        this.query = this.query.slice(0, -2);
        this.query += ')';
        this.query += ` VALUES (`;
        for (let d in data) {
            if (d != 'table' && data[d] != null) {
                if (typeof data[d] === 'string') this.query += `'${data[d]}', `;
                else this.query += `${data[d]}, `;
            }
        }
        this.query = this.query.slice(0, -2);
        this.query += ')';
        return this.runQuery()
                .then(res => { return res })
                .catch(err => { return err });        
    }

    async update(data)
    {
        this.query = `UPDATE ${this.tableName} SET `;
        for (let d in data) {
            if (d != 'table' && (!d.includes('_id')) && data[d] != null) {
                if (typeof data[d] === 'string') this.query += `${d}='${data[d]}', `;
                else this.query += `${d}=${data[d]}, `;
            }
        }
        this.query = this.query.slice(0, -2);

        const id = this.tableName + '_id';
        this.query += ` WHERE ${id}=${data[id]};`;
        return this.runQuery()
                .then(res => { return res })
                .catch(err => { return err });    
    }

    async find(id)
    {
        this.query = `SELECT * FROM ${this.tableName} WHERE ${this.tableName}_id = ${id}`;
        return this.runQuery()
            .then(res => { return res })
            .catch(err => { return err });
    }

    async execRawQueryString()
    {
        this.query = this.rawQueryString;
        return this.runQuery()
                .then(res => { return res })
                .catch(err => { return err });  
    }

    buildQuery()
    {
        for (let step of this.queryLoader) {
            switch (step['command']) {
                case "WHERE":
                    if (!this.query.includes('WHERE')) this.query += ` WHERE ${step['column']} ${step['operator']} ${step['value']}`
                    else this.query += ` AND ${step['column']} ${step['operator']} ${step['value']}`
                    break;
            }
        }
        this.query += ";";
    }

    runQuery() {
        return new Promise((resolve, reject) => {            
            connection.query(this.query, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

}
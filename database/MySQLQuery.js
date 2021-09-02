const connection = require('./config.js');
class MySQLQuery 
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

    orWhere(column, operator = '=', value)
    {
        this.queryLoader.push({command: "ORWHERE", column, operator, value});
        return this;
    }

    join(table, columnOne, columnTwo)
    {
        this.queryLoader.push({command: "JOIN", table, columnOne, columnTwo});
        return this;
    }

    limit(limit)
    {
        this.queryLoader.push({command: "LIMIT", limit});
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

    async getOneToMany(id, field)
    {
        this.query = `SELECT * FROM ${this.tableName} WHERE ${field} = ${id}`
        this.buildQuery();
        return this.runQuery()
            .then(res => { return res })
            .catch(err => { return err }); 
    }


    async delete(id)
    {
        this.query = `DELETE FROM ${this.tableName} WHERE ${this.tableName}_id = ${id}`;
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
            if (d != 'table' && data[d] != null && d.startsWith(this.tableName))
                this.query += `${d}, `;
        }
        this.query = this.query.slice(0, -2);
        this.query += ')';
        this.query += ` VALUES (`;
        for (let d in data) {
            if (d != 'table' && data[d] != null && d.startsWith(this.tableName)) {
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
            if (d != 'table' && (!d.includes('_id')) && data[d] != null && d.startsWith(this.tableName)) {
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
                    if (!this.query.includes('WHERE')) this.query += ` WHERE ${step['column']} ${step['operator']} '${step['value']}'`;
                    else this.query += ` AND ${step['column']} ${step['operator']} '${step['value']}'`;
                    break;
                case "ORWHERE":
                    this.query += ` OR ${step['column']} ${step['operator']} '${step['value']}'`;
                    break;
                case "JOIN":
                    this.query += ` JOIN ${step['table']} ON ${step['columnOne']} = ${step['columnTwo']}`;
                    break;
                case "LIMIT":
                    this.query += ` LIMIT ${step['limit']}`;
                    break;
            }
        }
        this.query += ";";
    }

    runQuery() {
        console.log(this.query)
        return new Promise((resolve, reject) => {            
            connection.query(this.query, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    async toSql()
    {
        this.query = `SELECT * FROM ${this.tableName}`;
        this.buildQuery();
        return this.query;
    }

}

exports.MySQLQuery = MySQLQuery;
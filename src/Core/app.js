const ApiRouter = require("../routes");
const {Pool} = require("pg");
const {json} = require("express");
const bodyParser = require("body-parser");

class App {
    constructor(port) {
        this.port = port;

        this.app = require('express')();
        this.app.use(json())
        this.app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        )

        const pool = new Pool({
            user: 'owner',
            host: '217.160.191.154',
            database: 'uni_db',
            password: 'oIARBQgl@Na3AM',
            port: 6543,
        });

        this._router = ApiRouter(pool);
        this._router.applyFor(this.app, pool)
    }

    start(){
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`);
        });
    }
}

module.exports = App;
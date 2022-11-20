require('dotenv').config();

const ApiRouter = require("../routes");
const {Pool, BoundPool} = require("pg");
const {json,} = require("express");
const bodyParser = require("body-parser");
const {ResultError} = require("./ResultWrapper");

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

        let configs = ['PG_HOST', 'PG_USER', 'PG_PASSWORD', 'PG_DB', 'PG_PORT'];
        for (let config of configs) {
            if (!process.env[config]) {
                throw new Error(`Missing required config: ${config}`);
            }
        }

        this.db = new Pool({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DB,
            password: process.env.PG_PASSWORD,
            port: process.env.PG_PORT,

            reconnectOnDatabaseIsStartingError: true,
            // Number of retries to attempt when there's an error matching `retryConnectionErrorCodes`. A value of 0 will disable connection retry.
            retryConnectionMaxRetries: 5,
            // Milliseconds to wait between retry connection attempts after receiving a connection error with code that matches `retryConnectionErrorCodes`. A value of 0 will try reconnecting immediately.
            retryConnectionWaitMillis: 100,
            // Error codes to trigger a connection retry.
            retryConnectionErrorCodes: ['ENOTFOUND', 'EAI_AGAIN'],

            connectionTimeoutMillis: 1000,
        });

        this.db.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
            process.exit(-1);
        });

        this._router = ApiRouter(this.db);
        this._router.applyFor(this.app, this.db);

        this.app.use((err, req, res, next) => {
            res.send(ResultError(500, err.message));
        });

        this.app.use((req, res, next) => {
            res.status(404)
                .json(ResultError(404, 'Ohh you are lost, read the API documentation to find your way back home :)'));
        });


    }

    async start() {

        // check connection
        let res = await this.db.connect()
            .catch((err) => {
                throw new Error('Failed to connect to database: ' + err.message);
            })
        res.release();

        console.log('Connected to database');
        this.app.listen(this.port, () => {
            console.log(`Listening backend on port ${this.port}`);
        });
    }
}

module.exports = App;
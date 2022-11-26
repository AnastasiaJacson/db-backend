import {ApiRouter} from "../routes";
import express, {json} from "express";
import bodyParser from "body-parser";
import {inError} from "./WrapError";
import knex from "knex";
import cors from "cors";

require('dotenv').config();

/** @typedef {function(import('express').Request, any, import('knex').Knex): Promise<any>} Controller */
/** @typedef {function(import('knex').Knex): any} DataModel */


export default class App {
    constructor(port) {
        this.port = port;

        this.app = express();
        this.app.use(cors())
        this.app.use(json())
        this.app.use(bodyParser.urlencoded({
            extended: true,
        }))

        let configs = ['PG_HOST', 'PG_USER', 'PG_PASSWORD', 'PG_DB', 'PG_PORT'];
        for (let config of configs) {
            if (!process.env[config]) {
                throw new Error(`Missing required config: ${config}`);
            }
        }

        this.db = knex({
            client: 'pg', version: '7.2', connection: {
                user: process.env.PG_USER,
                host: process.env.PG_HOST,
                database: process.env.PG_DB,
                password: process.env.PG_PASSWORD,
                port: process.env.PG_PORT,
            }, pool: {min: 0, max: 7}, acquireConnectionTimeout: 3000
        });

        this.db.on('error', (err) => {
            console.error('Unexpected Error on idle client', err);
            process.exit(-1);
        });

        this._router = ApiRouter(this.db);
        this._router.applyFor(this.app, this.db);

        this.app.use((err, req, res, next) => {
            res.send(inError(500, err.message));
        });

        this.app.use((req, res, next) => {
            res.status(404)
                .json(inError(404, 'Ohh you are lost, read the API documentation to find your way back home :)'));
        });
    }

    async start() {

        await this.db.raw("SELECT 1")
            .catch((err) => {
                throw new Error('Failed to connect to database: ' + err.message);
            });

        console.log('Connected to database');
        this.app.listen(this.port, () => {
            console.log(`Listening backend on port ${this.port}`);
        });
    }
}
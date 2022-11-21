// import router
import Router from './Core/router';

// import handlers
import {AlcoholicsListEndpoint, AlcoholicInfoEndpoint} from './Controller/SampleController';
import {AutocompleteEndpoint} from "./Controller/Autocomplete";

// define router
export const ApiRouter = (db) => new Router('/api', db)

    // get alcoholic info endpoint
    .get('/alcoholic/:id', AlcoholicInfoEndpoint)
    .get('/alcoholics', AlcoholicsListEndpoint)
    .post('/autocomplete', AutocompleteEndpoint)

// TODO: write query your endpoints below
// example: .METHOD(PATH, HANDLER)



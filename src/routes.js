// import router
import Router from './Core/router';

// import handlers
import { AlcoholicsListEndpoint, AlcoholicInfoEndpoint}from './Controller/SampleController';

// define router
export const ApiRouter = (db) => new Router('/api/v1', db)

    // get alcoholic info endpoint
    .get('/alcoholic/:id', AlcoholicInfoEndpoint)
    .get('/alcoholics', AlcoholicsListEndpoint)

    // TODO: write your endpoints below
    // .METHOD(PATH, HANDLER)



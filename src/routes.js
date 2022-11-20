// import router
const Router = require('./Core/router');

// import handlers
const { AlcoholicInfo } = require('./Controller/SampleController');

// define router
const ApiRouter = (db) => new Router('/api/v1', db)

    // get alcoholic info endpoint
    .get('/alcoholic/:id', AlcoholicInfo)

    // TODO: write your endpoints below
    // .METHOD(PATH, HANDLER)

module.exports = ApiRouter;

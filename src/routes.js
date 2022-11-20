// import router
const Router = require('./Core/router');

// import handlers
const { AlcoholicInfo } = require('./Controller/SampleController');

const ApiRouter = (db) => new Router('/api/v1', db)
    .get('/alcoholic/:id', AlcoholicInfo)

module.exports = ApiRouter;

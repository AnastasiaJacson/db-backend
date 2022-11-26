// import router
import Router from './Core/router';

// import handlers
import {AlcoholicsListEndpoint, AlcoholicInfoEndpoint, AddAlcoholicEndpoint} from './Controller/AlcoholicsController';
import {AutocompleteEndpoint} from "./Controller/AutocompleteController";
import { AddInspectorEndpoint, InspectorInfoEndpoint, InspectorsListEndpoint } from './Controller/InspectorsController';
import {
    Query10Endpoint,
    Query11Endpoint,
    Query12Endpoint,
    Query1Endpoint,
    Query2Endpoint,
    Query3Endpoint,
    Query4Endpoint,
    Query5Endpoint,
    Query6Endpoint,
    Query7Endpoint,
    Query8Endpoint,
    Query9Endpoint
} from './Controller/QueriesController';
import { AddJoinEventEndpoint } from './Controller/JoinEventsController';
import { AddLeaveEventEndpoint } from './Controller/LeaveEventsController';
import { AddEscapeEventEndpoint } from './Controller/EscapeEventsController';
import { AddFaintEventEndpoint } from './Controller/FaintEventsController';
import { AddBedChangeEventEndpoint } from './Controller/BedChangeEventsController';
import { AddAlcoPartyEventEndpoint } from './Controller/AlcoPartyEventsController';
import ApiTableBasicGet from "./ApiTable/get";
import Wrap from "./Core/WrapError";
import {StatsEndpoint} from "./Controller/StatsController";

// define router
export const ApiRouter = (db) => new Router('/api', db)

    // get alcoholic info endpoint
    .get('/alcoholics/:id', AlcoholicInfoEndpoint)
    .get('/alcoholics', AlcoholicsListEndpoint)
    .post('/alcoholics', AddAlcoholicEndpoint)

    .get('/inspectors/:id', InspectorInfoEndpoint)
    .get('/inspectors', InspectorsListEndpoint)
    .post('/inspectors', AddInspectorEndpoint)

    .post('/act/join', AddJoinEventEndpoint)
    .post('/act/leave', AddLeaveEventEndpoint)
    .post('/act/escape', AddEscapeEventEndpoint)
    .post('/act/bed_change', AddBedChangeEventEndpoint)
    .post('/act/faint', AddFaintEventEndpoint)
    .post('/act/alco_party', AddAlcoPartyEventEndpoint)

    .get('/alcoholic/:alcoholic_id/inspectors', Query1Endpoint)
    .get('/alcoholic/:alcoholic_id/beds', Query2Endpoint)
    .get('/inspector/:inspector_id/alcoholics', Query3Endpoint)
    .get('/alcoholic/:alcoholic_id/escaped_beds', Query4Endpoint)
    .get('/alcoholic/:alcoholic_id/inspectors/custom_filter', Query5Endpoint)
    .get('/event/join/inspectors/min/:amount', Query6Endpoint)
    .get('/event/join/alcoholics/min/:amount', Query7Endpoint)
    .get('/events', Query8Endpoint)
    .get('/alcoholic/:alcoholic_id/drinks/stat', Query9Endpoint)
    .get('/event/escape/stat/count', Query10Endpoint)
    .get('/beds/sort/custom', Query11Endpoint)
    .get('/alcoholic/:alcoholic_id/drinks/sort/custom', Query12Endpoint)

    .post('/autocomplete', AutocompleteEndpoint)
    .get('/api_table/:table', ApiTableBasicGet)
    .get('/stats', StatsEndpoint)

    .get('*', (req, res) => {
        res.json(Wrap.inError(404, 'Not found'));
    })



// TODO: write query your endpoints below
// example: .METHOD(PATH, HANDLER)



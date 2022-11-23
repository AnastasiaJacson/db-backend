// import router
import Router from './Core/router';

// import handlers
import {AlcoholicsListEndpoint, AlcoholicInfoEndpoint, AddAlcoholicEndpoint} from './Controller/AlcoholicsController';
import {AutocompleteEndpoint} from "./Controller/AutocompleteController";
import { AddInspectorEndpoint, InspectorInfoEndpoint, InspectorsListEndpoint } from './Controller/InspectorsController';
import { Query10Endpoint, Query11Endpoint, Query1Endpoint, Query2Endpoint, Query3Endpoint, Query4Endpoint, Query5Endpoint, Query6Endpoint, Query7Endpoint, Query8Endpoint, Query9Endpoint } from './Controller/QueriesController';
import { AddJoinEventEndpoint } from './Controller/JoinEventsController';
import { AddLeaveEventEndpoint } from './Controller/LeaveEventsController';
import { AddEscapeEventEndpoint } from './Controller/EscapeEventsController';
import { AddFaintEventEndpoint } from './Controller/FaintEventsController';
import { AddBedChangeEventEndpoint } from './Controller/BedChangeEventsController';
import { AddAlcoPartyEventEndpoint } from './Controller/AlcoPartyEventsController';

// define router
export const ApiRouter = (db) => new Router('/api', db)

    // get alcoholic info endpoint
    .get('/alcoholics/:id', AlcoholicInfoEndpoint)
    .get('/alcoholics', AlcoholicsListEndpoint)
    .post('/alcoholics', AddAlcoholicEndpoint)
    .get('/inspectors/:id', InspectorInfoEndpoint)
    .get('/inspectors', InspectorsListEndpoint)
    .post('/inspectors', AddInspectorEndpoint)
    .post('/autocomplete', AutocompleteEndpoint)
    .post('/act/join', AddJoinEventEndpoint)
    .post('/act/leave', AddLeaveEventEndpoint)
    .post('/act/escape', AddEscapeEventEndpoint)
    .post('/act/bed-change', AddBedChangeEventEndpoint)
    .post('/act/faint', AddFaintEventEndpoint)
    .post('/act/alco-party', AddAlcoPartyEventEndpoint)
    .get('/alcoholic/:a/inspectors', Query1Endpoint)
    .get('/alcoholic/:a/beds', Query2Endpoint)
    .get('/inspector/:i/alcoholics', Query3Endpoint)
    .get('/alcoholic/:a/escaped_beds', Query4Endpoint)
    .get('/alcoholic/:a/inspectors/custom_filter', Query5Endpoint)
    .get('/event/join/inspectors/min/:N', Query6Endpoint)
    .get('/event/join/alcoholics/min/:N', Query7Endpoint)
    .get('/events', Query8Endpoint)
    .get('/alcoholic/:a/drinks/stat', Query9Endpoint)
    .get('/event/escape/stat/count', Query10Endpoint)
    .get('/beds/sort/custom', Query11Endpoint)
    .get('/alcoholic/:a/drinks/sort/custom', Query11Endpoint)

// TODO: write query your endpoints below
// example: .METHOD(PATH, HANDLER)



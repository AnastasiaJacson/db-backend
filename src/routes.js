// import router
import Router from './Core/router';

// import handlers
import {AlcoholicsListEndpoint, AlcoholicInfoEndpoint, AddAlcoholicEndpoint} from './Controller/AlcoholicsController';
import {AutocompleteEndpoint} from "./Controller/AutocompleteController";
import { AddInspectorEndpoint, InspectorInfoEndpoint, InspectorsListEndpoint } from './Controller/InspectorsController';
import { Query1Endpoint } from './Controller/QueriesController';
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
    .get('/alcoholic/:a/inspectors', Query1Endpoint)
    .post('/act/join', AddJoinEventEndpoint)
    .post('/act/leave', AddLeaveEventEndpoint)
    .post('/act/escape', AddEscapeEventEndpoint)
    .post('/act/bed-change', AddBedChangeEventEndpoint)
    .post('/act/faint', AddFaintEventEndpoint)
    .post('/act/alco-party', AddAlcoPartyEventEndpoint)

// TODO: write query your endpoints below
// example: .METHOD(PATH, HANDLER)



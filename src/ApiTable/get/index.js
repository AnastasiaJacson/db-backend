import Wrap from '../../Core/WrapError'
import {JoinEventHandler} from './JoinEvent';
import {LeaveEventHandler} from "./LeaveEvent";
import {BedChangeEvent} from "./BedChangeEvent";
import {BedEntityHandler} from "./BedEntity";
import {EscapeEventHandler} from "./EscapeEvent";
import {FaintEventHandler} from "./FaintEvent";
import {AlcoPartyEventHandler} from "./AlcoParty";

/** @type Controller */
const handler = async (req, res, db) => {
    const { table } = req.params;
    let {
        limit,
        page,
    } = req.query;

    let allowed_tables = [
        'person.alcoholic',
        'person.inspector',
        'entity.drink'
    ];

    let custom_tables = {
        'act.join': JoinEventHandler,
        'act.leave': LeaveEventHandler,
        'act.escape': EscapeEventHandler,
        'act.faint': FaintEventHandler,
        'act.alco_party': AlcoPartyEventHandler,
        'act.bed_change': BedChangeEvent,
        'entity.bed': BedEntityHandler,
    }

    limit = !limit ? 20 : parseInt(limit);
    page = !page ? 1 : parseInt(page);

    if (!allowed_tables.includes(table) && !Object.keys(custom_tables).includes(table)) {
        return res
            .status(400)
            .json(Wrap.inError(404, 'Unknown table'));
    } else if(isNaN(limit) || isNaN(page) || limit < 0 || page < 1) {
        return res
            .status(400)
            .json(Wrap.inError(400, 'Invalid limit or page param'));
    }

    const offset = (page - 1) * limit;
    let total_count = 0;
    let result = [];

    if(Object.keys(custom_tables).includes(table)) {
        let func = custom_tables[table];

        let {
            rows_count,
            rows
        } = await func({
            table, offset, limit, body: req.body, db
        }).catch(err => {
                console.error(err);
                return res
                    .status(500)
                    .json(Wrap.inError(500, 'Something went wrong'));
            })

        if(res.headersSent) return;

        total_count = rows_count;
        result = rows;
    } else {
        result = await db
            .select('*')
            .from(table)
            .limit(limit)
            .offset(offset)
            .catch((err) => {
                console.error(err);
                return res
                    .status(500)
                    .json(Wrap.inError(500, 'Something went wrong'));
                // .send(Wrap.inError(500, err.message));
            });

        if (res.headersSent) return;

        let total_count_result = await db
            .count('*', {as: 'total_count'})
            .from(table)
            .catch((err) => {
                console.error(err);
                return res
                    .status(500)
                    .json(Wrap.inError(500, 'Something went wrong'));
                // .send(Wrap.inError(500, err.message));
            });

        total_count = parseInt(total_count_result[0].total_count)
    }

    if (res.headersSent) return;

    return res
        .status(200)
        .json(Wrap.inSuccess({
            rows: result,
            page,
            per_page: limit,
            total_count,
            total_pages: Math.ceil(total_count / limit),
        }));
}

export default handler;
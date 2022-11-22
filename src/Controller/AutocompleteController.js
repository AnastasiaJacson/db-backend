import ResultWrapper from '../Core/ResultWrapper'

/** @type Controller */
export const AutocompleteEndpoint = async (req, res, db) => {
    // get params
    let {
        search_in,
        search_text,
        table,
    } = req.body || {};

    let allowed_tables = ['person.inspector', 'person.alcoholic'];

    if (!allowed_tables.includes(table)) {
        return res
            .status(400)
            .send(ResultWrapper.error(400, 'Unknown table'));
    } else if (!Array.isArray(search_in)) {
        return res
            .status(400)
            .send(ResultWrapper.error(400, 'search_in must be an array'));
    } else if ([search_text, table].some((param) => typeof param !== 'string')) {
        return res
            .status(400)
            .send(ResultWrapper.error(400, 'All params expect `search_in` must be strings'));
    } else if (!search_text.trim() || !table.trim() || !search_in.length) {
        return res
            .status(400)
            .send(ResultWrapper.error(400, 'Missing required params'));
    }

    let query = db
        .select('*')
        .from(table);

    let as_id = search_in.every((field) => field.endsWith('_id'));

    for (let column of search_in) {
        let filtered_col = column.replace(/[^a-zA-Z\.\-\_]/g, '');
            if(as_id) {
                query = query.orWhereRaw(`"${filtered_col}"::text = ?`, [search_text]);
            } else {
                query = query.orWhereRaw(`"${filtered_col}"::text ILIKE ?`, [`%${search_text}%`]);
            }

        }

    let result = await query
        .catch((err) => {
            console.error(err);
            return res
                .status(500)
                .send(ResultWrapper.error(500, 'Something went wrong'));
                // .send(ResultWrapper.error(500, err.message));
        });

    if (res.headersSent) return;

    return res
        .status(200)
        .json(ResultWrapper.success(result));
}
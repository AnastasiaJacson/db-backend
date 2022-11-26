import Wrap from '../Core/WrapError'

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
        'entity.bed',
        'entity.drink',
    ];

    limit = !limit ? 20 : parseInt(limit);
    page = !page ? 1 : parseInt(page);

    if (!allowed_tables.includes(table)) {
        return res
            .status(400)
            .json(Wrap.inError(404, 'Unknown table'));
    } else if(isNaN(limit) || isNaN(page) || limit < 0 || page < 1) {
        return res
            .status(400)
            .json(Wrap.inError(400, 'Invalid limit or page param'));
    }

    const offset = (page - 1) * limit;


    let result = await db
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

    if(res.headersSent) return;

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
    let total_count = parseInt(total_count_result[0].total_count)


    if(res.headersSent) return;

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
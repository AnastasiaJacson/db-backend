const cte = `
    WITH cte AS (SELECT 'join'         EventType,
                        gen.created_at HappenedAt,
                        be.status,
                        be.bed_id
                 FROM act.bed be
                          JOIN act.join j ON j.bed_event_id = be.bed_event_id
                          JOIN act.general gen ON gen.general_id = j.general_id
                 UNION ALL
                 SELECT 'leave'        EventType,
                        gen.created_at HappenedAt,
                        be.status,
                        be.bed_id
                 FROM act.bed be
                          JOIN act.leave l ON l.bed_event_id = be.bed_event_id
                          JOIN act.general gen ON gen.general_id = l.general_id
                 UNION ALL
                 SELECT 'escape'       EventType,
                        gen.created_at HappenedAt,
                        be.status,
                        be.bed_id
                 FROM act.bed be
                          JOIN act.escape e ON e.bed_event_id = be.bed_event_id
                          JOIN act.general gen ON gen.general_id = e.general_id
                 UNION ALL
                 SELECT 'bed_change_to' EventType,
                        gen.created_at  HappenedAt,
                        be.status,
                        be.bed_id
                 FROM act.bed be
                          JOIN act.bed_change bc ON bc.to_bed_event_id = be.bed_event_id
                          JOIN act.general gen ON gen.general_id = bc.general_id
                 UNION ALL
                 SELECT 'bed_change_from' EventType,
                        gen.created_at    HappenedAt,
                        be.status,
                        be.bed_id
                 FROM act.bed be
                          JOIN act.bed_change bc ON bc.from_bed_event_id = be.bed_event_id
                          JOIN act.general gen ON gen.general_id = bc.general_id
                 )`;
const BASIC_QUERY = `
    ${cte}
    SELECT distinct on (bed_id) bed_id, coalesce(status::text, 'free') as status
    FROM cte
             RIGHT JOIN entity.bed USING (bed_id)
    ORDER BY bed_id, HappenedAt DESC
`
const COUNT_QUERY = `SELECT count(*) as count FROM entity.bed;`
const count = async ({table, page, limit, body, db}) => {
    let res = await db.raw(COUNT_QUERY);

    return res.rows[0].count;
}

/**
 * @param table {string}
 * @param page {number}
 * @param limit {number}
 * @param body {Record<string, string | boolean | number>}
 * @param db
 * @returns {*}
 */
const rows = async ({table, offset, limit, body, db}) => {
    return (await db
        .raw(`${BASIC_QUERY} LIMIT ${limit} OFFSET ${offset}`))
        .rows
}

export const BedEntityHandler = async (opts) => {
    return {
        rows: await rows(opts),
        rows_count: await count(opts),
    }
}
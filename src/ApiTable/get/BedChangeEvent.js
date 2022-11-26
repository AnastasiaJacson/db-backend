const BASIC_QUERY = `
    SELECT g.general_id as "event_id",

           from_b.alcoholic_id,
           a.full_name    as "alcoholic_full_name",
           a.dob          as "alcoholic_dob",
           a.phone_number as "alcoholic_phone_number",

           from_b.bed_id  as "from_bed_id",
           to_b.bed_id    as "to_bed_id",

           g.created_at,
           g.updated_at
    FROM act.bed_change ev
             INNER JOIN act.general g USING (general_id)
             INNER JOIN act.bed from_b ON from_b.bed_event_id = ev.from_bed_event_id
             INNER JOIN act.bed to_b ON to_b.bed_event_id = ev.to_bed_event_id
             INNER JOIN person.alcoholic a ON a.alcoholic_id = from_b.alcoholic_id
`;

const COUNT_QUERY = `
    with records as (${BASIC_QUERY})
    SELECT count(*) as count
    FROM records
`;

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

export const BedChangeEvent = async (opts) => {
    return {
        rows: await rows(opts),
        rows_count: await count(opts),
    }
}
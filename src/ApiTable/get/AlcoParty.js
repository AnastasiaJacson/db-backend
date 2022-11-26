const BASIC_QUERY = `
    SELECT g.general_id   as "event_id",
--            b.alcoholic_id,
           a.full_name    as "alcoholic_full_name",
           a.dob          as "alcoholic_dob",
           a.phone_number as "alcoholic_phone_number",


--            ev.bed_event_id,
           d.title        as "drink_title",
           d.proof        as "drink_proof",
--            b.status       as "bed_status",

           g.created_at,
           g.updated_at
    FROM act.alco_party ev
             INNER JOIN act.general g USING (general_id)
             INNER JOIN person.alcoholic a USING (alcoholic_id)
             INNER JOIN entity.drink d USING (drink_id)
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

export const AlcoPartyEventHandler = async (opts) => {
    return {
        rows: await rows(opts),
        rows_count: await count(opts),
    }
}
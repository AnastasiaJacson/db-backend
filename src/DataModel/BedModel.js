/** @type DataModel */
export const getFreeBed = (db) => async () => {
    let query = `
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
                              JOIN act.general gen ON gen.general_id = bc.general_id)
        SELECT q.bed_id, q.status
        FROM (SELECT distinct on (bed_id) bed_id, coalesce(status::text, 'free') as status
              FROM cte
                       RIGHT JOIN entity.bed USING (bed_id)
              ORDER BY bed_id, HappenedAt DESC) q
        WHERE status = 'free'
        LIMIT 1
        `;

    let err = false;
    let free_bed = await db
        .raw(query)
        .catch(() => err = true);

    if(!err && free_bed.rows.length > 0) {
        return free_bed.rows[0].bed_id;
    } else {
        return -1;
    }

}
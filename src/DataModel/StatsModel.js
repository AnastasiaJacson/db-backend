import {cte} from "../ApiTable/get/BedEntity";

/** @type DataModel */
export const StatsModel = (db) => async () => {
    try {
        let last_joined_alcoholic = await db
            .select('*')
            .from('person.alcoholic')
            .orderBy('alcoholic_id')
            .first();

        let total_alcoholics = (await db
                .raw('SELECT count(*) as "total_count" FROM person.alcoholic LIMIT 1')
        ).rows[0].total_count

        let today_joined = (await db
                .raw(`
                    SELECT count(*) as today_joined
                    FROM act.join
                    WHERE general_id in (SELECT general_id
                                         FROM act.general
                                         WHERE DATE(created_at) = CURRENT_DATE)
                `)
        ).rows[0].today_joined;

        let beds_remaining = (await db
            .raw(`
            ${cte},
            cte2 as (
                SELECT distinct on (bed_id) bed_id, coalesce(status::text, 'free') as status
                FROM cte
                         RIGHT JOIN entity.bed USING (bed_id)
                ORDER BY bed_id, HappenedAt DESC
            )
            SELECT count(*) as "free_beds"
            from cte2
            WHERE status = 'free'
        `)).rows[0].free_beds

        return {
            last_joined_alcoholic,
            total_alcoholics,
            today_joined,
            beds_remaining
        }
    } catch (e) {
        console.error(e)
        return false;
    }

}
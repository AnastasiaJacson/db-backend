export const query1 = (db) => async (alcId, from, to, joinCount) => {
    const sql = `
    WITH CTE AS
      (SELECT INS.*,
              COUNT(INS.INSPECTOR_ID) JOINCOUNT
          FROM ACT.BED BE
          JOIN ACT.JOIN J ON J.BED_EVENT_ID = BE.BED_EVENT_ID
          JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = J.GENERAL_ID
          JOIN PERSON.INSPECTOR INS ON INS.INSPECTOR_ID = J.INSPECTOR_ID
          WHERE BE.ALCOHOLIC_ID = ?
              AND GEN.CREATED_AT >= ?
              AND GEN.CREATED_AT <= ?
          GROUP BY INS.INSPECTOR_ID,
              INS.FULL_NAME,
              INS.DOB,
              INS.PHONE_NUMBER)
  SELECT *
  FROM CTE
  WHERE CTE.JOINCOUNT >= ?
    `;
    const values = [alcId, from, to, joinCount];

    const qResult = await db.raw(sql, values);

    return qResult.rows;
};

export const query2 = db => async (alcId, from, to) => {
    const query = `
    WITH cte AS (
        SELECT
        b.*,
        gen.created_at happenedAt
        FROM act.bed be
        JOIN entity.bed b ON b.bed_id = be.bed_id
        JOIN act.join j ON j.bed_event_id = be.bed_event_id
        JOIN act.general gen ON gen.general_id = j.general_id
        WHERE be.alcoholic_id = ?
        UNION ALL
        SELECT
        b.*,
        gen.created_at happenedAt
        FROM act.bed be
        JOIN entity.bed b ON b.bed_id = be.bed_id
        JOIN act.bed_change j ON j.to_bed_event_id = be.bed_event_id
        JOIN act.general gen ON gen.general_id = j.general_id
        WHERE be.alcoholic_id = ?
    )
    SELECT
    DISTINCT bed_id
    FROM cte
    WHERE happenedAt >= ?
    AND happenedAt <= ?
    `;
    const values = [alcId, alcId, from, to];

    const qResult = await db.raw(query, values);
    return qResult.rows;
};

export const query3 = db => async (inspId, from, to, joinCount) => {
    const query = `
    WITH CTE AS
	(SELECT ALC.*,
			COUNT(ALC.ALCOHOLIC_ID) JOINCOUNT
		FROM ACT.BED BE
		JOIN ACT.JOIN J ON J.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = J.GENERAL_ID
		JOIN PERSON.ALCOHOLIC ALC ON ALC.ALCOHOLIC_ID = BE.ALCOHOLIC_ID
		WHERE J.INSPECTOR_ID = ?
			AND GEN.CREATED_AT >= ?
			AND GEN.CREATED_AT <= ?
		GROUP BY ALC.ALCOHOLIC_ID,
			ALC.FULL_NAME,
			ALC.DOB,
			ALC.PHONE_NUMBER)
SELECT *
FROM CTE
WHERE CTE.JOINCOUNT >= ?
    `;
    const values = [inspId, from, to, joinCount];

    const qResult = await db.raw(query, values);
    return qResult.rows;
}

export const query4 = db => async (alcId, from, to) => {
    const query = `
    SELECT be.bed_id
		FROM ACT.BED BE
		JOIN ACT.escape e ON e.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = e.GENERAL_ID
		WHERE be.alcoholic_id = ?
			AND GEN.CREATED_AT >= ?
			AND GEN.CREATED_AT <= ?
	GROUP BY be.bed_id
    `;
    const values = [alcId, from, to];

    const qResult = await db.raw(query, values);
    return qResult.rows;
};

export const query5 = db => async (alcId) => {
    const query = `
    WITH join_cte AS (
        SELECT
        'join' AS evt_type,
        inspector_id,
        count(j.inspector_id) occurence
        FROM act.bed be
        JOIN act.join j ON j.bed_event_id = be.bed_event_id
        WHERE be.alcoholic_id = ?
        GROUP BY j.inspector_id
    ),
    leave_cte AS (
        SELECT
        'leave' AS evt_type,
        inspector_id,
        count(j.inspector_id) occurence
        FROM act.bed be
        JOIN act.leave j ON j.bed_event_id = be.bed_event_id
        WHERE be.alcoholic_id = ?
        GROUP BY j.inspector_id
    )
    SELECT
    *
    FROM leave_cte lc
    LEFT JOIN join_cte jc ON jc.inspector_id = lc.inspector_id
    WHERE lc.occurence > COALESCE(jc.occurence, 0)    
    `;
    const values = [alcId, alcId];

    const qResult = await db.raw(query, values);
    return qResult.rows;
};

export const query6 = db => async (joinCount, from, to) => {
    const query = `
    WITH cte AS (
        SELECT
        insp.*,
        COUNT(DISTINCT be.alcoholic_id) as joinCount
        FROM act.join j
        JOIN act.bed be ON be.bed_event_id = j.bed_event_id
        JOIN act.general gen ON gen.general_id = j.general_id
        JOIN person.inspector insp ON insp.inspector_id = j.inspector_id
        WHERE gen.created_at >= ?
        AND gen.created_at <= ?
        GROUP BY insp.inspector_id, insp.full_name, insp.dob, insp.phone_number
    )
    SELECT
    *
    FROM cte WHERE joinCount >= ?
    `;
    const values = [from, to, joinCount];

    const qResult = await db.raw(query, values);
    return qResult.rows;
}

export const query7 = db => async (joinCount, from, to) => {
    const query = `
    WITH cte AS (
        SELECT
        alc.*,
        COUNT(act.general_id) as joinCount
        FROM act.join j
        JOIN act.bed be ON be.bed_event_id = j.bed_event_id
        JOIN act.general gen ON gen.general_id = j.general_id
        JOIN person.alcoholic alc ON alc.alcoholic_id = be.alcoholic_id
        WHERE gen.created_at >= ?
        AND gen.created_at <= ?
        GROUP BY alc.alcoholic_id, alc.full_name, alc.dob, alc.phone_number
    )
    SELECT
    *
    FROM cte WHERE joinCount >= ?
    `;
    const values = [from, to, joinCount];

    const qResult = await db.raw(query, values);
    return qResult.rows;
};

export const query8 = db => async (inspId, alcId, from, to) => {
    const query = `
    WITH cte AS (
        SELECT
        'join' eventType,
        gen.created_at happenedAt,
        be.bed_id
        FROM act.join j
        JOIN act.bed be ON be.bed_event_id = j.bed_event_id
        JOIN act.general gen ON gen.general_id = j.general_id
        WHERE j.inspector_id = ?
        AND be.alcoholic_id = ?
        UNION ALL
        SELECT
        'leave' eventType,
        gen.created_at happenedAt,
        be.bed_id
        FROM act.leave j
        JOIN act.bed be ON be.bed_event_id = j.bed_event_id
        JOIN act.general gen ON gen.general_id = j.general_id
        WHERE j.inspector_id = ?
        AND be.alcoholic_id = ?
    )
    SELECT
    *
    FROM cte WHERE happenedAt >= ? AND happenedAt <= ?    
    `;

    const values = [inspId, alcId, inspId, alcId, from, to];

    const qResult = await db.raw(query, values);
    return qResult.rows;
};

export const query9 = db => async (alcId, count, from, to) => {
    const query = `
    WITH CTE AS
	(SELECT GEN.GENERAL_ID,
			AP.DRINK_ID,
			D.TITLE,
			D.PROOF,
			COUNT(DISTINCT AP_ALL.ALCOHOLIC_ID)
		FROM ACT.ALCO_PARTY AP
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = AP.GENERAL_ID
		JOIN ENTITY.DRINK D ON D.DRINK_ID = AP.DRINK_ID
		JOIN ACT.ALCO_PARTY AP_ALL ON AP_ALL.GENERAL_ID = GEN.GENERAL_ID
		WHERE AP.ALCOHOLIC_ID = ?
			AND GEN.CREATED_AT >= ?
			AND GEN.CREATED_AT <= ?
		GROUP BY GEN.GENERAL_ID,
			AP.DRINK_ID,
			D.TITLE,
			D.PROOF
		HAVING COUNT(DISTINCT AP_ALL.ALCOHOLIC_ID) >= ?)
SELECT DRINK_ID,
	TITLE,
	PROOF,
	COUNT(DISTINCT GENERAL_ID) AS DRINKCOUNT
FROM CTE
GROUP BY DRINK_ID,
	TITLE,
	PROOF
    `;

    const values = [alcId, from, to, count];

    const qResult = await db.raw(query, values);
    return qResult.rows;
};

export const query10 = db => async () => {
    const query = `
    WITH cte as (
        SELECT TO_CHAR(created_at, 'Month') AS "month"
        FROM act.escape e
        JOIN act.general gen ON gen.general_id = e.general_id
        )
        SELECT "month", COUNT(*)
        FROM cte
        GROUP BY "month"
    `;

    const qResult = await db.raw(query);
    return qResult.rows;
};

export const query11 = db => async (inspId, from, to) => {
    const query = `
    SELECT BE.BED_ID,
        COUNT(F.GENERAL_ID) AS FAINTCOUNT
    FROM ACT.FAINT F
    JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = F.GENERAL_ID
    JOIN ACT.BED BE ON BE.BED_EVENT_ID = F.BED_EVENT_ID
    JOIN ACT.JOIN J ON J.BED_EVENT_ID = BE.BED_EVENT_ID
    WHERE J.INSPECTOR_ID = ?
        AND GEN.CREATED_AT >= ?
        AND GEN.CREATED_AT <= ?
    GROUP BY BE.BED_ID
    ORDER BY COUNT(F.GENERAL_ID) DESC
    `;

    const values = [inspId, from, to];

    const qResult = await db.raw(query, values);
    return qResult.rows;
};

export const query12 = db => async (alcId, from, to) => {
    const query = `
    SELECT D.DRINK_ID,
        D.TITLE,
        D.PROOF,
        COUNT(DISTINCT AP_ALL.ALCOHOLIC_ID) ALCOHOLICCOUNT
    FROM ACT.ALCO_PARTY AP
    JOIN ENTITY.DRINK D ON D.DRINK_ID = AP.DRINK_ID
    JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = AP.GENERAL_ID
    JOIN ACT.ALCO_PARTY AP_ALL ON AP_ALL.GENERAL_ID = GEN.GENERAL_ID
    WHERE AP.ALCOHOLIC_ID = ?
        AND GEN.CREATED_AT >= ?
        AND GEN.CREATED_AT <= ?
    GROUP BY D.DRINK_ID,
        D.TITLE,
        D.PROOF
    ORDER BY COUNT(DISTINCT AP_ALL.ALCOHOLIC_ID)
    `;

    const values = [alcId, from, to];
    const qResult = await db.raw(query, values);
    return qResult.rows;
}

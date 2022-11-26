export const getBed = db => async bedId => {
    const query = `
        SELECT
        *
        FROM entity.bed
        WHERE bed_id = ?
    `;
    const values = [bedId];

    const qResult = await db.raw(query, values);
    return qResult.rows[0];
}

export const checkBedStatus = (db) => async bedId => {
    const query = `
    WITH cte AS (SELECT
      'join' EventType,
      gen.created_at HappenedAt,
      be.status
      FROM act.bed be
      JOIN act.join j ON j.bed_event_id = be.bed_event_id
      JOIN act.general gen ON gen.general_id = j.general_id
      WHERE be.bed_id = ?
      UNION ALL
      SELECT
      'leave' EventType,
      gen.created_at HappenedAt,
      be.status
      FROM act.bed be
      JOIN act.leave l ON l.bed_event_id = be.bed_event_id
      JOIN act.general gen ON gen.general_id = l.general_id
      WHERE be.bed_id = ?
      UNION ALL
      SELECT
      'escape' EventType,
      gen.created_at HappenedAt,
      be.status
      FROM act.bed be
      JOIN act.escape e ON e.bed_event_id = be.bed_event_id
      JOIN act.general gen ON gen.general_id = e.general_id
      WHERE be.bed_id = ?
      UNION ALL
      SELECT
      'bed_change_to' EventType,
      gen.created_at HappenedAt,
      be.status
      FROM act.bed be
      JOIN act.bed_change bc ON bc.to_bed_event_id = be.bed_event_id
      JOIN act.general gen ON gen.general_id = bc.general_id
      WHERE be.bed_id = ?
      UNION ALL
      SELECT
      'bed_change_from' EventType,
      gen.created_at HappenedAt,
      be.status
      FROM act.bed be
      JOIN act.bed_change bc ON bc.from_bed_event_id = be.bed_event_id
      JOIN act.general gen ON gen.general_id = bc.general_id
      WHERE be.bed_id = ?)
      SELECT
      status
      FROM cte
      ORDER BY HappenedAt DESC
      LIMIT 1
    `;

    const values = [bedId, bedId, bedId, bedId, bedId];

    const result = await db.raw(query, values);
    return result.rows.length ? result.rows[0].status : 'free';
};

export const isAlcoholicInBed = db => async alcId => {
    const values = [alcId, alcId, alcId, alcId];

    const query = `
    WITH CTE AS
	(
	    SELECT 'leave' event, BE.STATUS as STATUS, BE.BED_ID bed_id,
			GEN.CREATED_AT HAPPENEDAT
		FROM ACT.BED BE
		JOIN ACT.LEAVE L ON L.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = L.GENERAL_ID
		WHERE BE.ALCOHOLIC_ID = ?
		
		UNION ALL
		
		SELECT 'escape' event, BE.STATUS STATUS, BE.BED_ID bed_id,
			GEN.CREATED_AT HAPPENEDAT
		FROM ACT.BED BE
		JOIN ACT.ESCAPE E ON E.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = E.GENERAL_ID
		WHERE BE.ALCOHOLIC_ID = ?
		
		UNION ALL
		
		SELECT 'join' event, BE.STATUS STATUS, BE.BED_ID bed_id,
			GEN.CREATED_AT HAPPENEDAT
		FROM ACT.BED BE
		JOIN ACT.JOIN E ON E.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = E.GENERAL_ID
		WHERE BE.ALCOHOLIC_ID = ?
		
		UNION ALL
		
		SELECT 'bed_change' event, BE.STATUS STATUS, BE.BED_ID bed_id,
			GEN.CREATED_AT HAPPENEDAT
		FROM ACT.BED BE
		JOIN ACT.BED_CHANGE BC ON BC.TO_BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = BC.GENERAL_ID
		WHERE BE.ALCOHOLIC_ID = ?)
SELECT *
FROM CTE
ORDER BY HAPPENEDAT DESC
LIMIT 1
    `;

    const qResult = await db.raw(query, values);
    const result = qResult.rows;

    if (result.length > 0) {
        return result[0].status === 'occupied';
    } else {
        return false;
    }
};

export const areAllAlcoholicsInBed = db => async alcIds => {
    const values = [alcIds.join(',')];

    const query = `
    WITH alc_cte AS (
        SELECT
        CAST(string_to_table AS int) as alcoholic_id
        FROM string_to_table(?, ',')
    ),
    CTE AS
	(SELECT BE.STATUS STATUS,
			GEN.CREATED_AT HAPPENEDAT,
            be.alcoholic_id
		FROM ACT.BED BE
		JOIN ACT.LEAVE L ON L.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = L.GENERAL_ID
        JOIN alc_cte ac ON ac.alcoholic_id = be.alcoholic_id
		UNION ALL SELECT BE.STATUS STATUS,
			GEN.CREATED_AT HAPPENEDAT,
            be.alcoholic_id
		FROM ACT.BED BE
		JOIN ACT.ESCAPE E ON E.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = E.GENERAL_ID
        JOIN alc_cte ac ON ac.alcoholic_id = be.alcoholic_id
		UNION ALL SELECT BE.STATUS STATUS,
			GEN.CREATED_AT HAPPENEDAT,
            be.alcoholic_id
		FROM ACT.BED BE
		JOIN ACT.JOIN E ON E.BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = E.GENERAL_ID
        JOIN alc_cte ac ON ac.alcoholic_id = be.alcoholic_id
		UNION ALL SELECT BE.STATUS STATUS,
			GEN.CREATED_AT HAPPENEDAT,
            be.alcoholic_id
		FROM ACT.BED BE
		JOIN ACT.BED_CHANGE BC ON BC.FROM_BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = BC.GENERAL_ID
        JOIN alc_cte ac ON ac.alcoholic_id = be.alcoholic_id
		UNION ALL SELECT BE.STATUS STATUS,
			GEN.CREATED_AT HAPPENEDAT,
            be.alcoholic_id
		FROM ACT.BED BE
		JOIN ACT.BED_CHANGE BC ON BC.FROM_BED_EVENT_ID = BE.BED_EVENT_ID
		JOIN ACT.GENERAL GEN ON GEN.GENERAL_ID = BC.GENERAL_ID
        JOIN alc_cte ac ON ac.alcoholic_id = be.alcoholic_id)
        SELECT distinct ON (alcoholic_id) alcoholic_id, happenedAt, status
        FROM CTE
        ORDER BY alcoholic_id, HAPPENEDAT DESC;
    `;

    const qResult = await db.raw(query, values);
    const result = qResult.rows;

    if (result.length > 0) {
        return alcIds
            .map(alcId => result.find(alc => alc.alcoholic_d === alcId) && result.find(alc => alc.alcoholic_d === alcId).status === 'occupied')
            .every(Boolean);
    } else {
        return false;
    }
};

export const addJoinEvent = db => async (alcId, bedId, inspId) => {
    const values = [alcId, bedId, inspId];

    const query = `
    WITH CTE AS
      (INSERT INTO ACT.GENERAL DEFAULT
          VALUES RETURNING GENERAL_ID),
      CTE2 AS
      (INSERT INTO ACT.BED (ALCOHOLIC_ID, BED_ID, status)
          VALUES (?,?, 'occupied') RETURNING BED_EVENT_ID)
  INSERT INTO ACT.JOIN (BED_EVENT_ID,
  GENERAL_ID,
  INSPECTOR_ID)
  SELECT BED_EVENT_ID,
      GENERAL_ID, ?
  FROM CTE,
      CTE2;
    `;
    return await db.raw(query, values);
}

export const addBedChangeEvent = db => async (alcId, oldBedId, newBedId) => {
    const query = `
    WITH CTE AS
	(INSERT INTO ACT.GENERAL DEFAULT
		VALUES RETURNING GENERAL_ID),
	CTE2 AS
	(INSERT INTO ACT.BED (ALCOHOLIC_ID,BED_ID,STATUS)
		VALUES (?,?,'free') RETURNING BED_EVENT_ID),
	CTE3 AS
	(INSERT INTO ACT.BED (ALCOHOLIC_ID,BED_ID,STATUS)
		VALUES (?,?,'occupied') RETURNING BED_EVENT_ID)
INSERT INTO ACT.BED_CHANGE (GENERAL_ID,FROM_BED_EVENT_ID,TO_BED_EVENT_ID)
SELECT GENERAL_ID,
	CTE2.BED_EVENT_ID,
	CTE3.BED_EVENT_ID
FROM CTE,
	CTE2,
	CTE3
    `;

    const values = [alcId, oldBedId, alcId, newBedId];
    const qResult = await db.raw(query, values);
    return qResult;
};

export const addFaintEvent = db => async bedEventId => {
    const query = `
    WITH CTE AS
        (INSERT INTO ACT.GENERAL DEFAULT
            VALUES RETURNING GENERAL_ID)
    INSERT INTO ACT.faint (general_id, bed_event_id)
    SELECT GENERAL_ID,
        ?
    FROM CTE
    `;

    const values = [bedEventId];
    const qResult = await db.raw(query, values);
    return qResult;
};

export const addEscapeEvent = db => async (alcId, bedId) => {
    const query = `
    WITH CTE AS
        (INSERT INTO ACT.GENERAL DEFAULT
            VALUES RETURNING GENERAL_ID),
        CTE2 AS
        (INSERT INTO ACT.BED (ALCOHOLIC_ID,BED_ID,STATUS)
            VALUES (?,?,'free') RETURNING BED_EVENT_ID)
    INSERT INTO ACT.escape (general_id, bed_event_id)
    SELECT GENERAL_ID,
        CTE2.BED_EVENT_ID
    FROM CTE,
        CTE2
    `;

    const values = [alcId, bedId];
    const qResult = await db.raw(query, values);
    return qResult;
};

export const addLeaveEvent = db => async (alcId, bedId, inspId) => {
    const query = `
    WITH CTE AS
        (INSERT INTO ACT.GENERAL DEFAULT
            VALUES RETURNING GENERAL_ID),
        CTE2 AS
        (INSERT INTO ACT.BED (ALCOHOLIC_ID,BED_ID,STATUS)
            VALUES (?,?,'free') RETURNING BED_EVENT_ID)
    INSERT INTO ACT.leave (general_id, bed_event_id, inspector_id)
    SELECT GENERAL_ID,
        CTE2.BED_EVENT_ID,
        ?
    FROM CTE,
        CTE2
    `;

    const values = [alcId, bedId, inspId];
    const qResult = await db.raw(query, values);
    return qResult;
};

export const addAlcoPartyEvent = db => async (alcoholics) => {
    const query = `
    WITH GEN_CTE AS
	(INSERT INTO ACT.GENERAL DEFAULT
        VALUES RETURNING GENERAL_ID),
	CTE AS
	(SELECT STRING_TO_TABLE(?,

										',') ALCID_DRINKID),
	CTE2 AS
	(SELECT STRING_TO_ARRAY(ALCID_DRINKID,

										';') AS ARR
		FROM CTE)
    INSERT INTO act.alco_party (general_id, alcoholic_id, drink_id)
SELECT GENERAL_ID,
CAST(ARR[1] AS int) ALCID,
CAST(ARR[2] AS int) DRINKID
	
FROM CTE2,
	GEN_CTE
    `;

    const param = alcoholics.map(a => `${a.id};${a.drinkId}`).join(',');
    const values = [param];
    const qResult = await db.raw(query, values);
    return qResult;
};

export const getAlcoholicBedId = db => async alcId => {
    const query = `
    SELECT
    be.bed_id
    FROM act.join j
    JOIN act.bed be ON be.bed_event_id = j.bed_event_id
    JOIN act.general gen ON gen.general_id = j.general_id
    WHERE be.alcoholic_id = ?
    ORDER BY gen.created_at desc
    LIMIT 1
    `;

    const values = [alcId];

    const qResult = await db.raw(query, values);
    return qResult.rows.length ? qResult.rows[0].bed_id : null;
};

export const getAlcoholicBedEventId = db => async alcId => {
    const query = `
    SELECT
    be.bed_event_id
    FROM act.join j
    JOIN act.bed be ON be.bed_event_id = j.bed_event_id
    JOIN act.general gen ON gen.general_id = j.general_id
    WHERE be.alcoholic_id = ?
    ORDER BY gen.created_at desc
    LIMIT 1
    `;

    const values = [alcId];

    const qResult = await db.raw(query, values);
    return qResult.rows.length ? qResult.rows[0].bed_event_id : null;
};

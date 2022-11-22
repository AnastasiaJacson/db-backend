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
              AND GEN.CREATED_AT <= ?
              AND GEN.CREATED_AT >= ?
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

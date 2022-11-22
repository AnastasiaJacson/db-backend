export const areAllDrinksPresent = db => async drinkIds => {
    const query = `
    WITH drink_cte AS (
        SELECT
        CAST(string_to_table AS int) AS drink_id
        FROM string_to_table(?, ',')
    )
    SELECT
    d.*
    FROM entity.drink d
    JOIN drink_cte dc ON dc.drink_id = d.drink_id
    `;

    const values = [drinkIds.join(',')];
    const qResult = await db.raw(query, values);
    const result = qResult.rows;

    return result.length === drinkIds.length;
};

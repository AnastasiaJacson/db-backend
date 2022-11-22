/** @type DataModel */
export const getAlcoholic = (db) => (id) => {
    return db
        .select('*')
        .from('person.alcoholic')
        .where('alcoholic_id', id)
        .first();
}

/** @type DataModel */
export const getAlcoholics = (db) => () => {
    return db
        .select('*')
        .from('person.alcoholic');
}

export const addAlcoholic = (db) => async (reqBody) => {
    return await db.raw(`
    INSERT INTO person.alcoholic
    (full_name, dob, phone_number)
    VALUES (?, ?, ?)
    `, [reqBody.fullName, reqBody.dob, reqBody.phoneNumber]);
}

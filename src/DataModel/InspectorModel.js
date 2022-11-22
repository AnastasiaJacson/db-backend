/** @type DataModel */
export const getInspector = (db) => (id) => {
    return db
        .select('*')
        .from('person.inspector')
        .where('inspector_id', id)
        .first();
}

/** @type DataModel */
export const getInspectors = (db) => () => {
    return db
        .select('*')
        .from('person.inspector');
}

export const addInspector = (db) => async (reqBody) => {
    return await db.raw(`
    INSERT INTO person.inspector
    (full_name, dob, phone_number)
    VALUES (?, ?, ?)
    `, [reqBody.fullName, reqBody.dob, reqBody.phoneNumber]);
}

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
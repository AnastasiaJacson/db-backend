const getAllAlcoholics = (db, id) => {
    return db.query("SELECT * FROM person.alcoholic");

}

module.exports = {
    getAllAlcoholics
}
const getAlcoholic = (db, id) => {
    return db.query("SELECT * FROM person.alcoholic WHERE alcoholic_id = $1", [id])
}

module.exports = {
    getAlcoholic
}
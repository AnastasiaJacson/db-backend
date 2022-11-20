const { getAlcoholic } = require('../DataModel/SampleModel');
const { ResultWrapper } = require('../Core/ResultWrapper');

const AlcoholicInfo = async (req, res, db) => {
    let {id} = req.params;

    let result = await getAlcoholic(db, id)
        .catch((err) => {
            return res
                .status(500)
                .send(ResultWrapper.error(500, err));
        });


    if (!result.statusCode) {
        if (!result.rowCount) {
            return res
                .status(404)
                .send(ResultWrapper.error(404, 'Alcoholic not found'));
        }

        let alcoholic = result.rows[0];

        return res
            .status(200)
            .json(ResultWrapper.success(alcoholic));
    }
}

module.exports = {
    AlcoholicInfo
}
const { getAllAlcoholics } = require('../DataModel/SampleModel');
const { ResultWrapper } = require('../Core/ResultWrapper');

const AlcoholicInfo = async (req, res, db) => {
    let {id} = req.params;

    let alcoholics = await getAllAlcoholics(db, id)
        .catch((err) => {
            return res
                .status(500)
                .send(ResultWrapper.error(500, err));
        });

    if (alcoholics) {
        return res
            .status(200)
            .json(ResultWrapper.success(alcoholics));
    }
}

module.exports = {
    AlcoholicInfo
}
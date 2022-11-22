import {addAlcoholic, getAlcoholic, getAlcoholics} from '../DataModel/AlcoholicModel'
import ResultWrapper from '../Core/ResultWrapper'

/** @type Controller */
export const AlcoholicInfoEndpoint = async (req, res, db) => {
    let {id} = req.params;

    let alcoholic = await getAlcoholic(db)(id)
        .catch((err) => {
            return res
                .status(500)
                .send(ResultWrapper.error(500, err));
        });

    if (res.headersSent) return;

    if (alcoholic) {
        return res
            .status(200)
            .json(ResultWrapper.success(alcoholic));
    } else {
        return res
            .status(404)
            .send(ResultWrapper.error(404, 'Alcoholic not found'));
    }
}

/** @type Controller */
export const AlcoholicsListEndpoint = async (req, res, db) => {
    let result = await getAlcoholics(db)()
        .catch((err) => {
            return res
                .status(500)
                .send(ResultWrapper.error(500, err));
        });

    if (res.headersSent) return;

    return res
        .status(200)
        .json(ResultWrapper.success(result));
}


export const AddAlcoholicEndpoint = async (req, res, db) => {
    try {
        let result = await addAlcoholic(db)(req.body);
        return res
            .status(200)
            .json(ResultWrapper.success(result));
    } catch (err) {
        return res.status(500)
            .send(ResultWrapper.error(500, err));
    }
}

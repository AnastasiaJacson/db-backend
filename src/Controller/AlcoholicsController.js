import { addAlcoholic, getAlcoholic, getAlcoholics } from '../DataModel/AlcoholicModel'
import Wrap from '../Core/WrapError'

/** @type Controller */
export const AlcoholicInfoEndpoint = async (req, res, db) => {
    let { id } = req.params;

    let alcoholic = await getAlcoholic(db)(id)
        .catch((err) => {
            return res
                .status(500)
                .send(Wrap.inError(500, err));
        });

    if (res.headersSent) return;

    if (alcoholic) {
        return res
            .status(200)
            .json(Wrap.inSuccess(alcoholic));
    } else {
        return res
            .status(404)
            .send(Wrap.inError(404, 'Alcoholic not found'));
    }
}

/** @type Controller */
export const AlcoholicsListEndpoint = async (req, res, db) => {
    let result = await getAlcoholics(db)()
        .catch((err) => {
            return res
                .status(500)
                .send(Wrap.inError(500, err));
        });

    if (res.headersSent) return;

    return res
        .status(200)
        .json(Wrap.inSuccess(result));
}


export const AddAlcoholicEndpoint = async (req, res, db) => {
    const { fullName, dob, phoneNumber } = req.body;

    if (!fullName || !dob || !phoneNumber) {
        return res.status(400)
            .send(Wrap.inError(400, 'Invalid data'));
    }

    try {
        let result = await addAlcoholic(db)(fullName, dob, phoneNumber);
        return res
            .status(200)
            .json(Wrap.inSuccess(result));
    } catch (err) {
        return res.status(500)
            .send(Wrap.inError(500, err));
    }
}

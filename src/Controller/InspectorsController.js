import {addAlcoholic, getAlcoholic, getAlcoholics} from '../DataModel/AlcoholicModel'
import ResultWrapper from '../Core/ResultWrapper'
import { addInspector, getInspector, getInspectors } from '../DataModel/InspectorModel';

/** @type Controller */
export const InspectorInfoEndpoint = async (req, res, db) => {
    let {id} = req.params;

    let inspector = await getInspector(db)(id)
        .catch((err) => {
            return res
                .status(500)
                .send(ResultWrapper.error(500, err));
        });

    if (res.headersSent) return;

    if (inspector) {
        return res
            .status(200)
            .json(ResultWrapper.success(inspector));
    } else {
        return res
            .status(404)
            .send(ResultWrapper.error(404, 'Alcoholic not found'));
    }
}

/** @type Controller */
export const InspectorsListEndpoint = async (req, res, db) => {
    let result = await getInspectors(db)()
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


export const AddInspectorEndpoint = async (req, res, db) => {
    try {
        let result = await addInspector(db)(req.body);
        return res
            .status(200)
            .json(ResultWrapper.success(result));
    } catch (err) {
        return res.status(500)
            .send(ResultWrapper.error(500, err));
    }
}

import Wrap from '../Core/WrapError'
import { addInspector, getInspector, getInspectors } from '../DataModel/InspectorModel';

/** @type Controller */
export const InspectorInfoEndpoint = async (req, res, db) => {
    let {id} = req.params;

    let inspector = await getInspector(db)(id)
        .catch((err) => {
            return res
                .status(500)
                .send(Wrap.inError(500, err));
        });

    if (res.headersSent) return;

    if (inspector) {
        return res
            .status(200)
            .json(Wrap.inSuccess(inspector));
    } else {
        return res
            .status(404)
            .send(Wrap.inError(404, 'Alcoholic not found'));
    }
}

/** @type Controller */
export const InspectorsListEndpoint = async (req, res, db) => {
    let result = await getInspectors(db)()
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


export const AddInspectorEndpoint = async (req, res, db) => {
    const {fullName, dob, phoneNumber} = req.body;
    if (!fullName || !dob || !phoneNumber) {
        return res.status(400)
            .send(Wrap.inError(400, 'Invalid data'));
    }
    
    try {
        let result = await addInspector(db)(fullName, dob, phoneNumber);
        return res
            .status(200)
            .json(Wrap.inSuccess(result));
    } catch (err) {
        return res.status(500)
            .send(Wrap.inError(500, err));
    }
}

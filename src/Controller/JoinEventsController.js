import Wrap from "../Core/WrapError";
import {getAlcoholic} from "../DataModel/AlcoholicModel";
import {addJoinEvent, checkBedStatus, getBed, isAlcoholicInBed} from "../DataModel/EventModel";
import {getInspector} from "../DataModel/InspectorModel";
import { getFreeBed } from "../DataModel/BedModel"

export const AddJoinEventEndpoint = async (req, res, db) => {
    let {
        alcoholic_id,
        inspector_id
    } = req.body;

    console.log(req.body)

    if (!(await getAlcoholic(db)(alcoholic_id))) {
        res.status(200).json(Wrap.inError(404, 'Alcoholic does not exist'));
        return;
    }
    console.log(1)

    if (!(await getInspector(db)(inspector_id))) {
        res.status(200).json(Wrap.inError(400, 'Inspector does not exist'));
        return;
    }
    console.log(2)


    const isAlcInBed = await isAlcoholicInBed(db)(alcoholic_id);
    if (isAlcInBed) {
        res.status(200).json(Wrap.inError(400, 'Alcoholic already in Detoxer'));
        return;
    }

    const free_bed = await getFreeBed(db)();

    console.log(3)

    if (free_bed === -1) {
        res
            .status(200)
            .json(Wrap.inError(400, 'There are no free beds in Detoxer'));
        return;
    }

    console.log(4)

    try {
        const result = await addJoinEvent(db)(alcoholic_id, free_bed, inspector_id);
        return res.status(200).json(Wrap.inSuccess(result));
    } catch (err) {
        res.status(500).json(Wrap.inError(500, err));
    }
};

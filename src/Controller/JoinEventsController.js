import ResultWrapper from "../Core/ResultWrapper";
import { getAlcoholic } from "../DataModel/AlcoholicModel";
import { addJoinEvent, checkBedStatus, getBed, isAlcoholicInBed } from "../DataModel/EventModel";
import { getInspector } from "../DataModel/InspectorModel";

export const AddJoinEventEndpoint = async (req, res, db) => {
    if (!(await getBed(db)(req.body.bedId))) {
        res.status(404).json(ResultWrapper.error(404, 'Bed does not exist'));
        return;  
    }

    if (!(await getAlcoholic(db)(req.body.alcoholicId))) {
        res.status(404).json(ResultWrapper.error(404, 'Alcoholic does not exist'));
        return;  
    }

    if (!(await getInspector(db)(req.body.inspectorId))) {
        res.status(400).json(ResultWrapper.error(400, 'Inspector does not exist'));
        return;  
    }
    
    const bedStatus = await checkBedStatus(db)(req.body.bedId);
    if (bedStatus == 'occupied') {
      res.status(400).json(ResultWrapper.error(400, 'Bed is in use'));
      return;
    }

    const isAlcInBed = await isAlcoholicInBed(db)(req.body.alcoholicId);
    if (isAlcInBed) {
      res.status(400).json(ResultWrapper.error(400, 'Alcoholic already in bed'));
      return;
    }
  
    try {
        const result = await addJoinEvent(db)(req.body.alcoholicId, req.body.bedId, req.body.inspectorId);
        return res.status(200).json(ResultWrapper.success(result));
    } catch (err) {
        res.status(500).json(ResultWrapper.error(500, err));
    }
};

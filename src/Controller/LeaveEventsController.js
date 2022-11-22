import ResultWrapper from "../Core/ResultWrapper";
import { addJoinEvent, checkBedStatus, isAlcoholicInBed } from "../DataModel/EventModel";

export const AddLeaveEventEndpoint = async (req, res, db) => {
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

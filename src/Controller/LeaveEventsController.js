import ResultWrapper from "../Core/ResultWrapper";
import { addEscapeEvent, addJoinEvent, addLeaveEvent, checkBedStatus, getAlcoholicBedId, isAlcoholicInBed } from "../DataModel/EventModel";

export const AddLeaveEventEndpoint = async (req, res, db) => {
  const { alcoholicId, inspectorId } = req.body;
  const isAlcInBed = await isAlcoholicInBed(db)(alcoholicId);
  if (!isAlcInBed) {
    res.status(400).json(ResultWrapper.error(400, 'Alcoholic is not in bed'));
    return;
  }

  const alcBedId = await getAlcoholicBedId(db)(alcoholicId);
  if (!alcBedId) {
    res.status(400).json(ResultWrapper.error(400, 'Alcoholic is not in bed'));
    return;
  }

  try {
    const result = await addLeaveEvent(db)(alcoholicId, alcBedId, inspectorId);
    return res.status(200).json(ResultWrapper.success(result));
  } catch (err) {
    res.status(500).json(ResultWrapper.error(500, err));
  }
};

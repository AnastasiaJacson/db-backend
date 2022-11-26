import Wrap from "../Core/WrapError";
import { addEscapeEvent, addJoinEvent, addLeaveEvent, checkBedStatus, getAlcoholicBedId, isAlcoholicInBed } from "../DataModel/EventModel";

export const AddLeaveEventEndpoint = async (req, res, db) => {
  const { alcoholic_id, inspector_id } = req.body;
  let alcoholicId = alcoholic_id;
  let inspectorId = inspector_id;
  const isAlcInBed = await isAlcoholicInBed(db)(alcoholicId);
  if (!isAlcInBed) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic is not in Detoxer'));
    return;
  }

  const alcBedId = await getAlcoholicBedId(db)(alcoholicId);
  if (!alcBedId) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic is not in Detoxer'));
    return;
  }

  try {
    const result = await addLeaveEvent(db)(alcoholicId, alcBedId, inspectorId);
    return res.status(200).json(Wrap.inSuccess(result));
  } catch (err) {
    res.status(500).json(Wrap.inError(500, err));
  }
};

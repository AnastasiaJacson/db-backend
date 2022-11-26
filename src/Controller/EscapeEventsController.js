import Wrap from "../Core/WrapError";
import { addEscapeEvent, getAlcoholicBedId, isAlcoholicInBed } from "../DataModel/EventModel";

export const AddEscapeEventEndpoint = async (req, res, db) => {
  const { alcoholic_id } = req.body;
  let alcoholicId = alcoholic_id;
  const isAlcInBed = await isAlcoholicInBed(db)(alcoholicId);
  if (!isAlcInBed) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic is not in bed'));
    return;
  }

  const alcBedId = await getAlcoholicBedId(db)(alcoholicId);
  if (!alcBedId) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic is not in bed'));
    return;
  }

  try {
    const result = await addEscapeEvent(db)(alcoholicId, alcBedId);
    return res.status(200).json(Wrap.inSuccess(result));
  } catch (err) {
    res.status(500).json(Wrap.inError(500, err));
  }
};

import Wrap from "../Core/WrapError";
import { getAlcoholic } from "../DataModel/AlcoholicModel";
import { addFaintEvent, addJoinEvent, checkBedStatus, getAlcoholicBedEventId, getAlcoholicBedId, isAlcoholicInBed } from "../DataModel/EventModel";

export const AddFaintEventEndpoint = async (req, res, db) => {
  const { alcoholic_id } = req.body;
  let alcoholicId = alcoholic_id;

  if (!(await getAlcoholic(alcoholicId))) {
    res.status(200).json(Wrap.inError(404, 'Alcoholic does not exist'));
    return;
  }

  const isAlcInBed = await isAlcoholicInBed(db)(alcoholicId);
  if (!isAlcInBed) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic not in bed'));
    return;
  }

  const alcBedEventId = await getAlcoholicBedEventId(db)(alcoholicId);
  if (!alcBedEventId) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic not in bed (4290)'));
    return;
  }

  try {
    const result = await addFaintEvent(db)(alcBedEventId);
    return res.status(200).json(Wrap.inSuccess(result));
  } catch (err) {
    res.status(500).json(Wrap.inError(500, err));
  }
};

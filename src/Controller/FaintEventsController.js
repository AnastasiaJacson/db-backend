import ResultWrapper from "../Core/ResultWrapper";
import { getAlcoholic } from "../DataModel/AlcoholicModel";
import { addFaintEvent, addJoinEvent, checkBedStatus, getAlcoholicBedEventId, getAlcoholicBedId, isAlcoholicInBed } from "../DataModel/EventModel";

export const AddFaintEventEndpoint = async (req, res, db) => {
  const { alcoholicId } = req.body;
  if (!(await getAlcoholic(alcoholicId))) {
    res.status(404).json(ResultWrapper.error(400, 'Alcoholic does not exist'));
    return;
  }

  const isAlcInBed = await isAlcoholicInBed(db)(alcoholicId);
  if (!isAlcInBed) {
    res.status(400).json(ResultWrapper.error(400, 'Alcoholic not in bed'));
    return;
  }

  const alcBedEventId = await getAlcoholicBedEventId(db)(alcoholicId);
  if (!alcBedEventId) {
    res.status(400).json(ResultWrapper.error(400, 'Alcoholic not in bed'));
    return;
  }

  try {
    const result = await addFaintEvent(db)(alcBedEventId);
    return res.status(200).json(ResultWrapper.success(result));
  } catch (err) {
    res.status(500).json(ResultWrapper.error(500, err));
  }
};

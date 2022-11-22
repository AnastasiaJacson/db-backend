import ResultWrapper from "../Core/ResultWrapper";
import { getAlcoholic } from "../DataModel/AlcoholicModel";
import { addBedChangeEvent, checkBedStatus, getAlcoholicBedId, getBed, isAlcoholicInBed } from "../DataModel/EventModel";

export const AddBedChangeEventEndpoint = async (req, res, db) => {
  const { alcoholicId, newBedId } = req.body;
  if (!(await getBed(db)(newBedId))) {
    res.status(400).json(ResultWrapper.error(400, 'Bed does not exist'));
    return;
  }

  if (!(await getAlcoholic(db)(alcoholicId))) {
    res.status(400).json(ResultWrapper.error(400, 'Alcoholic does not exist'));
    return;
  }

  const bedStatus = await checkBedStatus(db)(newBedId);
  if (bedStatus == 'occupied') {
    res.status(400).json(ResultWrapper.error(400, 'Bed is in use'));
    return;
  }

  const isAlcInBed = await isAlcoholicInBed(db)(req.body.alcoholicId);
  if (!isAlcInBed) {
    res.status(400).json(ResultWrapper.error(400, 'Alcoholic is not in bed'));
    return;
  }

  const oldBedId = await getAlcoholicBedId(db)(alcoholicId);
  if (!oldBedId) {
    res.status(400).json(ResultWrapper.error(400, 'Alcoholic did not join jet'));
    return;
  }
  if (oldBedId === newBedId) {
    res.status(400).json(ResultWrapper.error(400, 'Cannot place into the same bed'));
    return;
  }

  try {
    const result = await addBedChangeEvent(db)(alcoholicId, oldBedId, newBedId);
    return res.status(200).json(ResultWrapper.success(result));
  } catch (err) {
    res.status(500).json(ResultWrapper.error(500, err));
  }
};

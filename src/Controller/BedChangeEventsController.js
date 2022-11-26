import Wrap from "../Core/WrapError";
import { getAlcoholic } from "../DataModel/AlcoholicModel";
import { addBedChangeEvent, checkBedStatus, getAlcoholicBedId, getBed, isAlcoholicInBed } from "../DataModel/EventModel";

export const AddBedChangeEventEndpoint = async (req, res, db) => {
  const { alcoholic_id, new_bed_id } = req.body;
  let alcoholicId = alcoholic_id;
  let newBedId = new_bed_id;

  if (!(await getBed(db)(newBedId))) {
    res.status(200).json(Wrap.inError(400, 'Bed does not exist'));
    return;
  }

  if (!(await getAlcoholic(db)(alcoholicId))) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic does not exist'));
    return;
  }

  const bedStatus = await checkBedStatus(db)(newBedId);
  if (bedStatus === 'occupied') {
    res.status(200).json(Wrap.inError(400, 'Bed is in use'));
    return;
  }

  const isAlcInBed = await isAlcoholicInBed(db)(alcoholicId);
  if (!isAlcInBed) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic is not in Detoxer'));
    return;
  }

  const oldBedId = await getAlcoholicBedId(db)(alcoholicId);
  if (!oldBedId) {
    res.status(200).json(Wrap.inError(400, 'Alcoholic did not join jet'));
    return;
  }

  if (oldBedId === newBedId) {
    res.status(200).json(Wrap.inError(400, 'Cannot place into the same bed'));
    return;
  }

  try {
    const result = await addBedChangeEvent(db)(alcoholicId, oldBedId, newBedId);
    return res.status(200).json(Wrap.inSuccess(result));
  } catch (err) {
    res.status(500).json(Wrap.inError(500, err));
  }
};

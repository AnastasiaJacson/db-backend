import ResultWrapper from "../Core/ResultWrapper";
import { areAllDrinksPresent } from "../DataModel/DrinkModel";
import { addAlcoPartyEvent, areAllAlcoholicsInBed } from "../DataModel/EventModel";

export const AddAlcoPartyEventEndpoint = async (req, res, db) => {
  const { alcoholics } = req.body;

  const areAllInBed = areAllAlcoholicsInBed(db)(alcoholics.map(a => a.id));
  if (!areAllInBed) {
    res.status(400).json(ResultWrapper.error(400, 'Not all are in bed'));
    return;
  }

  const areDrinksPresent = areAllDrinksPresent(db)(alcoholics.map(a => a.drinkId));
  if (!areDrinksPresent) {
    res.status(400).json(ResultWrapper.error(400, 'Not all drinks are present'));
    return;
  }

  try {
    const result = await addAlcoPartyEvent(db)(alcoholics);
    return res.status(200).json(ResultWrapper.success(result));
  } catch (err) {
    console.error(err);
    res.status(500).json(ResultWrapper.error(500, err));
  }
};

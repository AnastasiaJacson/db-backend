import {getAlcoholic, getAlcoholics} from '../DataModel/AlcoholicModel'
import Wrap from '../Core/WrapError'
import {StatsModel} from "../DataModel/StatsModel";

/** @type Controller */
export const StatsEndpoint = async (req, res, db) => {
    let stats = await StatsModel(db)();
    console.log(stats);
    // res.send(1);
    return res
        .status(200)
        .json(stats);
}
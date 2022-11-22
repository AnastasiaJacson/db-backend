import ResultWrapper from "../Core/ResultWrapper";
import { query1 } from "../DataModel/QueriesModel";

export const Query1Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.a;
    const from = req.query.F;
    const to = req.query.T;
    const joinCount = req.query.N;

    const queryResult = await query1(db)(alcoholicId, from, to, joinCount);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

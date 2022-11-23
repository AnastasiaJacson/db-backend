import ResultWrapper from "../Core/ResultWrapper";
import { query1, query10, query11, query12, query2, query3, query4, query5, query6, query7, query8, query9 } from "../DataModel/QueriesModel";

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

export const Query2Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.a;
    const from = req.query.F;
    const to = req.query.T;

    const queryResult = await query2(db)(alcoholicId, from, to);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query3Endpoint = async (req, res, db) => {
    const inspectorId = req.params.i;
    const from = req.query.F;
    const to = req.query.T;
    const joinCount = req.query.N;

    const queryResult = await query3(db)(inspectorId, from, to, joinCount);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query4Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.a;
    const from = req.query.F;
    const to = req.query.T;

    const queryResult = await query4(db)(alcoholicId, from, to);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query5Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.a;

    const queryResult = await query5(db)(alcoholicId);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query6Endpoint = async (req, res, db) => {
    const joinCount = req.params.N;
    const from = req.query.F;
    const to = req.query.T;

    const queryResult = await query6(db)(joinCount, from, to);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query7Endpoint = async (req, res, db) => {
    const joinCount = req.params.N;
    const from = req.query.F;
    const to = req.query.T;

    const queryResult = await query7(db)(joinCount, from, to);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query8Endpoint = async (req, res, db) => {
    const inspectorId = req.query.I;
    const alcoholicId = req.query.A;
    const from = req.query.F;
    const to = req.query.T;

    const queryResult = await query8(db)(inspectorId, alcoholicId, from, to);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query9Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.A;
    const count = req.query.N;
    const from = req.query.F;
    const to = req.query.T;

    const queryResult = await query9(db)(alcoholicId, count, from, to);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query10Endpoint = async (req, res, db) => {
    const queryResult = await query10(db)();

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query11Endpoint = async (req, res, db) => {
    const inspectorId = req.query.I;
    const from = req.query.F;
    const to = req.query.T;

    const queryResult = await query11(db)(inspectorId, from, to);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

export const Query12Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.a;
    const from = req.query.F;
    const to = req.query.T;

    const queryResult = await query12(db)(alcoholicId, from, to);

    try {
        return res.status(200).json(ResultWrapper.success(queryResult));
    } catch (err) {
        res.status(500).send(ResultWrapper.error(500, err));
    }
};

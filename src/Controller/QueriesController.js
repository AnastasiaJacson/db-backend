import Wrap from "../Core/WrapError";
import { query1, query2, query3, query4, query5, query6, query7, query8, query9, query10, query11, query12 } from "../DataModel/QueriesModel";

export const Query1Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.alcoholic_id;
    const from = req.query.start_date;
    const to = req.query.end_date;
    const joinCount = req.query.amount;

    if (!alcoholicId || !from || !to || !joinCount) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query1(db)(alcoholicId, from, to, joinCount);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query2Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.alcoholic_id;
    const from = req.query.start_date;
    const to = req.query.end_date;

    if (!alcoholicId || !from || !to) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query2(db)(alcoholicId, from, to);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query3Endpoint = async (req, res, db) => {
    const inspectorId = req.params.inspector_id;
    const from = req.query.start_date;
    const to = req.query.end_date;
    const joinCount = req.query.amount;

    if (!inspectorId || !from || !to || !joinCount) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query3(db)(inspectorId, from, to, joinCount);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query4Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.alcoholic_id;
    const from = req.query.start_date;
    const to = req.query.end_date;

    if (!alcoholicId || !from || !to) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query4(db)(alcoholicId, from, to);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query5Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.alcoholic_id;

    if (!alcoholicId) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query5(db)(alcoholicId);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query6Endpoint = async (req, res, db) => {
    const joinCount = req.params.amout;
    const from = req.query.start_date;
    const to = req.query.end_date;

    if (!joinCount || !from || !to) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query6(db)(joinCount, from, to);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query7Endpoint = async (req, res, db) => {
    const joinCount = req.params.amount;
    const from = req.query.start_date;
    const to = req.query.end_date;

    if (!joinCount || !from || !to) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query7(db)(joinCount, from, to);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query8Endpoint = async (req, res, db) => {
    const inspectorId = req.query.inspector_id;
    const alcoholicId = req.query.alcoholic_id;
    const from = req.query.start_date;
    const to = req.query.end_date;

    if (!alcoholicId || !inspectorId || !from || !to) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query8(db)(inspectorId, alcoholicId, from, to);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query9Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.alcoholic_id;
    const count = req.query.amount;
    const from = req.query.start_date;
    const to = req.query.end_date;

    if (!alcoholicId || !from || !to || !count) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query9(db)(alcoholicId, count, from, to);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query10Endpoint = async (req, res, db) => {
    const queryResult = await query10(db)();

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query11Endpoint = async (req, res, db) => {
    const inspectorId = req.query.inspector_id;
    const from = req.query.start_date;
    const to = req.query.end_date;

    if (!inspectorId || !from || !to) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query11(db)(inspectorId, from, to);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

export const Query12Endpoint = async (req, res, db) => {
    const alcoholicId = req.params.alcoholic_id;
    const from = req.query.start_date;
    const to = req.query.end_date;

    if (!alcoholicId || !from || !to) {
        return res.status(400).json(Wrap.inError(400, 'Invalid query string'));
    }

    const queryResult = await query12(db)(alcoholicId, from, to);

    try {
        return res.status(200).json(Wrap.inSuccess(queryResult));
    } catch (err) {
        res.status(500).send(Wrap.inError(500, err));
    }
};

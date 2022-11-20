class BaseDataModel {
    constructor(db) {
        this._db = db;
    }

    async run() {
        throw new Error("Not implemented");
    }
}
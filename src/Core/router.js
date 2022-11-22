import path from 'path'

export class Router {
    constructor(path = '/api') {
        this.router = [];
        this.path = path;
    }

    /**
     * @param method {string}
     * @param url {string}
     * @param handler {Controller}
     * @param ignore_base {boolean}
     * @returns {Router}
     */
    addRoute(method, url, handler, ignore_base = false) {
        this.router.push({
            method,
            url: ignore_base ? url : this.path + url,
            handler,
        });
        return this;
    }

    /**
     * @method
     * @param url {string}
     * @param handler {Controller}
     * @param ignore_base {boolean}
     * @returns {Router}
     */
    get(url, handler, ignore_base = false) {
        return this.addRoute('GET', url, handler, ignore_base);
    }

    /**
     * @method
     * @param url {string}
     * @param handler {Controller}
     * @param ignore_base {boolean}
     * @returns {Router}
     */
    post(url, handler, ignore_base = false) {
        return this.addRoute('POST', url, handler, ignore_base);
    }

    /**
     * @method
     * @param url {string}
     * @param handler {Controller}
     * @param ignore_base {boolean}
     * @returns {Router}
     */
    put(url, handler, ignore_base = false) {
        return this.addRoute('PUT', url, handler, ignore_base);
    }

    /**
     * @method
     * @param url {string}
     * @param handler {Controller}
     * @param ignore_base {boolean}
     * @returns {Router}
     */
    delete(url, handler, ignore_base = false) {
        return this.addRoute('DELETE', url, handler, ignore_base);
    }

    /**
     * @method
     * @param url {string}
     * @param handler {Controller}
     * @param ignore_base {boolean}
     * @returns {Router}
     */
    patch(url, handler, ignore_base = false) {
        return this.addRoute('PATCH', url, handler, ignore_base);
    }

    applyFor(app, db) {
        this.build()
            .forEach(route => {
                app[route.method.toLowerCase()](route.url, (req, res) => {
                    route.handler(req, res, db);
                });
            });
    }

    /** @private */
    build() {
        return Object.freeze(this.router);
    }
}

export default Router;
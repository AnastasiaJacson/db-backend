const path = require('path')

class Router {
    constructor(path = '/api') {
        this.router = [];
        this.path = path;
    }

    addRoute(method, url, handler, ignore_base = false){
        this.router.push({
            method,
            url: ignore_base ? url : path.join(this.path, url),
            handler,
        });
        return this;
    }

    get(url, handler, ignore_base = false){
        return this.addRoute('GET', url, handler, ignore_base);
    }

    post(url, handler){
        return this.addRoute('POST', url, handler);
    }

    put(url, handler){
        return this.addRoute('PUT', url, handler);
    }

    delete(url, handler){
        return this.addRoute('DELETE', url, handler);
    }

    patch(url, handler){
        return this.addRoute('PATCH', url, handler);
    }

    applyFor(app, db){
        this.build()
            .forEach(route => {
                app[route.method.toLowerCase()](route.url, (req,res) => {
                    route.handler(req, res, db);
                });
            });
    }

    build(){
        return Object.freeze(this.router);
    }
}

module.exports = Router;
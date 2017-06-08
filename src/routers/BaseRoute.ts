import * as express from 'express';
import {Router} from 'express';

export abstract class BaseRoute {

    router: Router;

    constructor(){
        this.router = express.Router();
        this.initRoutes()
    }

    public getRoutes(): Router {
        return this.router
    }

    abstract initRoutes(): void
}


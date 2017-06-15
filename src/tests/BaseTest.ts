import * as chai from 'chai';
import * as chaiHttp from 'chai-http';
import {default as server} from '../index'
import {User} from '../models/user';
import * as jwt from 'jsonwebtoken';


export class BaseTest {

    chai: any;
    server: any;
    should: any;
    route: string;

    constructor() {
        this.route = `/${process.env.API_VERSION}/`;
        this.chai = chai;
        this.chai.use(chaiHttp);
        this.server = server;
        this.should = chai.should();
    }

    ask(question: string): any {
        console.log(question);
        return new Promise<string>((resolve) => {
            process.stdin.once('data', (data) => {
                resolve(data.toString().trim());
            });
        });
    }

    public getJWT(): Promise<any> {
       return new Promise((resolve)=>{
           User.findOne({},(err, user) => {
                const token = jwt.sign(user,
                    process.env.APPLICATION_SECRET, {
                        expiresIn: 604800
                    });
                resolve(token);
            });
        });
    }

}
import {Strategy, ExtractJwt} from 'passport-jwt';
import {default as User} from '../models/user';
import {Passport} from "passport";

export class PassportConfig {

    public passport: Passport;

    constructor(passport: any){
        this.passport = passport;
    }

    public init() {
        let opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            secretOrKey: process.env.APPLICATION_SECRET
        };
        this.passport.use(new Strategy(opts, (jwt_payload, done) => {
            User.findOne({_id: jwt_payload._doc._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }));
    }
}

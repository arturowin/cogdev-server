import {BaseTest} from '../BaseTest';
import * as readline from 'readline';

describe('/POST user/auth/', () => {

    const test = new BaseTest();

    let user = {
        uid: '1',
        auth_code: '1',
        displayName: 'test user',
        email: 'test@mailinator.com',
        photoURL: 'photo.jpg'
    };


    it('it should return JWT token', (done) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter the auth code here: ', (auth_code) => {
            rl.close();
            user.auth_code = auth_code.toString().trim();
            test.chai.request(test.server)
                .post(`${test.route}user/auth/`)
                .send(user)
                .end((err, res) => {
                    res.status.should.equal(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.equal(true);
                    res.body.should.have.property('token');
                    res.body.token.should.be.a('string');
                    done();
                });
        });
    });

    it('it should return error message', (done) => {
        test.chai.request(test.server)
            .post(`${test.route}user/auth/`)
            .send({})
            .end((err, res) => {
                res.status.should.equal(403);
                res.body.should.be.a('object');
                res.body.should.have.property('success');
                res.body.success.should.equal(false);
                res.body.should.have.property('message');
                done();
            });
    });

});

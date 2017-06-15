import {User} from '../../models/user';
import {ISeeder} from './ISeeder';
import {GoogleService} from '../../services/google.service';
import * as readline from 'readline';

export class UserSeeder implements ISeeder {

    seedData: any;

    constructor() {
        this.seedData = {
            accessToken: '',
            refreshToken: '',
            displayName: '',
            email: '',
            photoURL: '',
            uid: ''
        };
    }

    seed(): Promise<any> {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question('Enter the auth code here: ', (auth_code) => {
                rl.close();
                auth_code = auth_code.toString().trim();
                const googleService = new GoogleService();
                googleService.getToken(auth_code, (err, tokens) => {
                    if (err) {
                        console.log(err);
                        process.exit(1);
                    }

                    googleService.authorize(tokens.access_token, tokens.refresh_token);

                    googleService.getGUser((err, gUser)=>{
                        if (err) {
                            console.log(err);
                            process.exit(1);
                        }

                        this.seedData.accessToken = tokens.access_token;
                        this.seedData.refreshToken = tokens.refresh_token;
                        this.seedData.uid = gUser.id;
                        this.seedData.displayName = gUser.name;
                        this.seedData.photoURL = gUser.photoURL;
                        this.seedData.email = gUser.email;
                        User.createOrUpdate(this.seedData, (err, success) => {
                            if (err) throw err;
                            console.info(`\x1b[32m`, 'UserSeeder seeded.');
                            resolve(success);
                        });
                    });
                });
            });
        });

    }

}
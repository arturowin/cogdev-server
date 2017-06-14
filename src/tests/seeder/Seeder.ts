import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { UserSeeder } from './UserSeeder';

class Seeder {

    constructor() {
        dotenv.config({ path: ".env.test" });
        this.database().then(() =>{
            this.initSeed().then(()=>{
                process.exit();
            })
        });
    }

    private async database(): Promise<any> {
        mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
        mongoose.connection.on('error', () => {
            console.log('MongoDB connection error.');
            process.exit(1);
        });
         return await mongoose.connection.on('connected', () => {
            return mongoose.connection.db.dropDatabase();
        });
    }

     public initSeed(): Promise<any> {
         let task = Promise.resolve();
         task = task.then(() => {
             return new UserSeeder().seed();
         });
         return task;
     }
}

new Seeder();
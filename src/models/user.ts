import {Schema, Model, Document, model} from 'mongoose';


export interface IUser extends Document {
    uid: String;
    displayName: String;
    photoURL: String;
    email: String;
    accessToken: String;
    refreshToken: String;
    groups: Array<String>;
    location: String;
    timezone: String;
}

export interface IUserModel {
    createOrUpdate(upsertData: any, callback: any): void
}

const userSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    photoURL: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    groups: {
        type: Array,
    },
    location: {
        type: String,
    },
    timezone: {
        type: String,
    },
    create_date: {
        type: Date,
        "default": Date.now()
    }
});

userSchema.static('createOrUpdate', (upsertData: any, callback: any) => {
    User.update({uid: upsertData.uid}, upsertData, {upsert: true}, callback);
});

export type UserModel = Model<IUser> & IUserModel & IUser;

export const User: UserModel = <UserModel>model<IUser>("User", userSchema);
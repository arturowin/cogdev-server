import {Schema, Model, Document, model} from 'mongoose';


export interface IUser extends Document {
    uid: string;
    displayName: string;
    photoURL: string;
    email: string;
    activeDevices: number;
    status: string;
    accessToken: string;
    refreshToken: string;
    groups: Array<string>;
    location: string;
    timezone: string;
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
    status: {
        type: String,
        required: true
    },
    activeDevices: {
      type: Number,
      required: true,
      "default": 0
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
    createAt: {
        type: Date,
        "default": Date.now()
    },
    updatedAt: {
        type: Date,
        "default": Date.now()
    }
});

userSchema.static('createOrUpdate', (upsertData: any, callback: any) => {
    User.update({uid: upsertData.uid}, upsertData, {upsert: true}, callback);
});

export type UserModel = Model<IUser> & IUserModel & IUser;

export const User: UserModel = <UserModel>model<IUser>("User", userSchema);
import {Schema, model, Document} from 'mongoose';


interface IUser extends Document {
    uid: String;
    displayName: String;
    photoURL: String;
    email: String;
    accessToken: String;
    refreshToken: String;
    groups: Array<String>;
    location: String;
    timezone: String;
    createOrUpdate: (upsertData: any, callback: any) => void
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
        type: Date
    }
}, {timestamps: true});

userSchema.pre('save', (next) => {
    if (!this.create_date) {
        this.create_date = Date.now();
    }
    next();
});

userSchema.methods.createOrUpdate = (upsertData: any, callback: any) => {
    User.update({uid: upsertData.uid}, upsertData, {upsert: true}, callback);
};

const User = model<IUser>('User', userSchema);

export default User;
export const UserSchema = User.schema.methods;
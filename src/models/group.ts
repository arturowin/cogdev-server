import {Schema, Model, Document, model} from 'mongoose';

export interface IGroup extends Document {
    ownerId: String;
    name: String;
    description?: String;
    members: String;
}

export interface IGroupModel {

}

const groupSchema = new Schema({
    ownerId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    members: {
        type: Array,
        required: true
    },
    create_date: {
        type: Date,
        "default": Date.now()
    }
});

export type GroupModel = Model<IGroup> & IGroupModel & IGroup;

export const Group: GroupModel = <GroupModel>model<IGroup>("Group", groupSchema);
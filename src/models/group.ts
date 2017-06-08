import {Schema, model, Document} from 'mongoose';

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
    }
});
const Group = model('Group', groupSchema);

export default Group;
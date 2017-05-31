const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
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
        default: Date.now
    }
});

const Group = module.exports = mongoose.model('Group', groupSchema);

/**
 * create new group or update existing
 * @param upsertData
 * @param callback
 */
module.exports.createOrUpdateGroup = (upsertData, callback) => {
    Group.update({uid: upsertData.uid}, upsertData, {upsert: true}, callback);
};


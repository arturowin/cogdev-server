const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
    groups:{
        type: Array,
    },
    location:{
        type: String,
    },
    timezone:{
        type: String,
    },
    create_date:{
        type: Date,
        default: Date.now
    }
});

const User = module.exports = mongoose.model('User', userSchema);

/**
 * create new user or update existing
 * @param upsertData
 * @param callback
 */
module.exports.createOrUpdateUser = (upsertData, callback) => {
    User.update({uid: upsertData.uid}, upsertData, {upsert: true}, callback);
};


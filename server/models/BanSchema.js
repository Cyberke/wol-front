const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const banSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    bannedIpList: [{
        ip: {
            type: String
        },

        bannedAt: {
            type: Date,
            default: Date.now()
        }
    }],

    bannedUserList: [{
        user: {
            type: String
        },

        bannedAt: {
            type: Date,
            default: Date.now()
        }
    }],
});

module.exports = banList = mongoose.model('banList', banSchema);
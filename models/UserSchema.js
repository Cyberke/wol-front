const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    profile: {
        username: {
            type: String,
            required: true
        },
    
        name: {
            type: String,
            default: 'Nincs Megadva',
        },
    
        email: {
            type: String,
            required: true
        },
    
        password: {
            type: String,
            required: true
        },
    
        profilePicture: {
            type: String,
            default: 'https://i.imgur.com/ceDUpKL.png'
        },
    
        biography: {
            type: String,
            default: 'Wolimbyt használok.'
        },
    
        roles: {
            type: Array,
            default: [0]
        },

        notificationList: [{
            title: {
                type: String
            },

            profilePicture: {
                type: String,
                default: 'https://i.imgur.com/N72oZnx.png'
            },
    
            message: {
                type: String
            },
    
            createdAt: {
                type: Date,
                default: Date.now()
            }
        }],
    
        ipList: [{
            ip: {
                type: String
            },
    
            loggedAt: {
                type: Date,
                default: Date.now()
            }
        }],

        createdAt: {
            type: Date,
            default: Date.now()
        }
    },

    privacy: {
        showName: {
            type: Boolean,
            default: true
        },

        showEmail: {
            type: Boolean,
            default: true
        }
    },

    appearance: {
        backgroundImage: {
            type: String,
            default: 'none'
        },

        theme: {
            type: String,
            default: 'dark'
        },
    }
});

module.exports = User = mongoose.model('user', userSchema);
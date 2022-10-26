const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const reqip = require('request-ip');
// const nodemailer = require('nodemailer');
const key = process.env.SECRET_KEY;
const User = require('../../models/UserSchema');
const BanList = require('../../models/BanSchema');
const middleware = require('../../middlewares/userMiddleware');
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     tls: {
//         rejectUnauthorized: false
//     },
//     auth: {
//         user: 'wolimby@gmail.com',
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

/**
 * @route POST users/login
 * @desc Bejelentkezés
 * @access Publikus
 */

router.post('/login', middleware.login, async (req, res) => {
    const user = await User.findOne({ 'profile.username': req.body.username }) || await User.findOne({ 'profile.email': req.body.username });

    async function ipLogging() {
        if (user.profile.ipList.length == 0) {
            const ip = { 'profile.ipList': [{ ip: reqip.getClientIp(req) }] };
            await User.updateOne({ 'profile.username': req.body.username }, { $push: ip }) || await User.updateOne({ 'profile.email': req.body.email }, { $push: ip });
        } else {
            if (user.profile.ipList.length > 5) {
                user.profile.ipList.shift();
                await user.save();
            }

            for (let i = 0; i < user.profile.ipList.length; i++) {
                if (user.profile.ipList[i].ip == reqip.getClientIp(req)) {
                    await user.profile.ipList.splice(user.profile.ipList.map(x => x.ip).indexOf(reqip.getClientIp(req)), 1);
                    break;
                }
            }

            await user.profile.ipList.push({ ip: reqip.getClientIp(req), loggedAt: new Date() });
            await user.save();
        }
    }

    const validPassword = await bcrypt.compare(req.body.password, user.profile.password);
    try {
        if (validPassword) {
            const payload = {
                _id: user._id,
                username: user.profile.username,
                name: user.profile.name,
                email: user.profile.email
            }
            jwt.sign(payload, key, {
                expiresIn: 604800
            }, (err, token) => {
                ipLogging();
                return res.status(200).send({
                    success: true,
                    user: user,
                    token: `Bearer ${token}`,
                    message: 'Sikeres bejelentkezés.'
                });
            })
        } else {
            return res.status(404).send({
                success: false,
                message: 'A megadott jelszó helytelen.'
            });
        }
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
});

/**
 * @route POST users/register
 * @desc Regisztráció
 * @access Publikus
 */

router.post('/register', middleware.register, async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        profile: {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        }
    });

    try {
        newUser.save().then(() => {
            // transporter.sendMail({
            //     from: 'Wolimby',
            //     to: req.body.email,
            //     subject: 'Regisztráció',
            //     html: `
            //     <h1>Sikeres regisztráció</h1>
            //     <br>
            //     <h3>Kérdés esetén írj egy emailt erre az email címre, vagy csatlakozz fel a <a href="https://discord.gg/FqdMuyhdTC">Discord szerverre</a></h3>
            //     <br>
            //     <h2><img src="https://i.imgur.com/N72oZnx.png" style="width: 50px; height: 50px; border-radius: 50%;"> © Wolimby.</h2>
            //     `
            // }, (err, res) => {
            //     if(err) {
            //         console.log(err);
            //     }
            // });

            return res.status(201).send({
                success: true,
                message: 'Sikeres regisztráció.'
            });
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
});

/**
 * @route PATCH users/patch/{userId}
 * @desc Felhasználó frissítés
 * @access Privát
 */

 router.patch('/patch/:id', middleware.isLoggedIn, middleware.patchUser, async (req, res) => {
    try {
        let temp = {};
        switch(req.query.patching) {
            case 'profile':
                if(req.body.password) {
                    const salt = await bcrypt.genSalt(10);
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                }
                
                for(let field in req.body) {
                    temp['profile.' + field] = req.body[field];
                }
                await User.updateOne({ _id: req.params.id }, { $set: temp });
                break;
            case 'appearance':
                for(let field in req.body) {
                    temp['appearance.' + field] = req.body[field];
                }
                await User.updateOne({ _id: req.params.id }, { $set: temp });
                break;
            case 'privacy':
                for(let field in req.body) {
                    temp['privacy.' + field] = req.body[field];
                }
                await User.updateOne({ _id: req.params.id }, { $set: temp });
                break;
        }
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }

    const userToPatch = await User.findOne({ _id: req.params.id });

    return res.status(201).send({
        success: true,
        message: 'Sikeres mentés.',
        user: userToPatch
    });
});

/**
 * @route POST users/notification/push/{userId}
 * @desc Értesítés push
 * @access Privát
 */

 router.post('/notification/push/:id', middleware.isLoggedIn, async (req, res) => {
    try {
        const notification = { 'profile.notificationList': [{ title: req.body.title, message: req.body.message }] };
        await User.updateOne({ _id: req.params.id }, { $push: notification });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }

    const userToPatch = await User.findOne({ _id: req.params.id });

    return res.status(201).send({
        success: true,
        message: 'Sikeres mentés.',
        user: userToPatch
    });
});

/**
 * @route DELETE users/notifications/delete/{userId}
 * @desc Felhasználó értesítéseinek törlése
 * @access Privát
 */

 router.delete('/notifications/delete/:id', middleware.isLoggedIn, async (req, res) => {
    try {
        await User.updateOne({ _id: req.params.id}, { $set: {'profile.notificationList': []}}, { multi: true });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }

    const userToPatch = await User.findOne({ _id: req.params.id });

    return res.send({
        success: true,
        message: 'Sikeres törlés.',
        user: userToPatch
    });
});

/**
 * @route POST users/ban?ip&?userid
 * @desc Felhasználó bannolása
 * @access Publikus
*/

router.post('/ban', async (req, res) => {
    const id = '123BANLIST456';
    const banlistdb = await BanList.findOne({ _id: id });

    try {
        if(req.query.ip) {
            let ipbanned = false;
            for (let i = 0; i < banlistdb.bannedIpList.length; i++) {
                if (banlistdb.bannedIpList[i].ip == req.query.ip) {
                    ipbanned = true;
                    break;
                } else {
                    ipbanned = false;
                }
            }
    
            if(ipbanned) {
                return res.status(201).send({
                    success: false,
                    message: 'Ez az IP már bannolva van.',
                    banned: true
                });
            } else {
                const ip = { bannedIpList: [{ ip: req.query.ip }] };
                await BanList.updateOne({ _id: id }, { $push: ip });
    
                return res.status(201).send({
                    success: true,
                    message: 'Sikeres bannolás.',
                });
            }
        } else if(req.query.id) {
            let idbanned = false;
            for (let i = 0; i < banlistdb.bannedUserList.length; i++) {
                if (banlistdb.bannedUserList[i].user == req.query.id) {
                    idbanned = true;
                    break;
                } else {
                    idbanned = false;
                }
            }
    
            if(idbanned) {
                return res.status(201).send({
                    success: false,
                    message: 'Ez az ID már bannolva van.',
                    banned: true
                });
            } else {
                const userid = { bannedUserList: [{ user: req.query.id }] };
                await BanList.updateOne({ _id: id }, { $push: userid });
    
                return res.status(201).send({
                    success: true,
                    message: 'Sikeres bannolás.',
                });
            }
        }
    } catch(err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
});

/**
 * @route GET users/checkban
 * @desc Ban check
 * @access Publikus
*/

router.get('/checkban', async (req, res) => {
    const id = '123BANLIST456';
    const banlistdb = await BanList.findOne({ _id: id });

    if(banlistdb == null) {
        const newBanList = new BanList({
            _id: id
        });

        try {
            newBanList.save().then(() => {
                return res.status(201).send({
                    success: true,
                    message: 'Sikeres ban lista készítés. Índitsd újra a műveletet.'
                });
            });
        } catch (err) {
            return res.status(404).send({
                success: false,
                error: err.message
            });
        }
    } else {
        try {
            let banned = false;
            for (let i = 0; i < banlistdb.bannedIpList.length; i++) {
                if (banlistdb.bannedIpList[i].ip == reqip.getClientIp(req)) {
                    banned = true;
                    break;
                } else {
                    banned = false;
                }
            }
    
            if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                try {
                    const decode = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY);
    
                    for (let i = 0; i < banlistdb.bannedUserList.length; i++) {
                        if (banlistdb.bannedUserList[i].user == decode._id) {
                            banned = true;
                            break;
                        } else {
                            banned = false;
                        }
                    }
                } catch {
                }
            }
    
            if(banned) {
                return res.status(201).send({
                    success: false,
                    message: 'Bannolva van.',
                    banned: true,
                });
            } else {
                return res.status(201).send({
                    success: false,
                    message: 'Nincs bannolva.',
                    banned: false,
                });
            }
        } catch(err) {
            return res.status(404).send({
                success: false,
                error: err.message
            });
        }
    }
});

/**
 * @route GET users/removeban
 * @desc Ban check
 * @access Publikus
*/

router.delete('/removeban', async (req, res) => {
    const id = '123BANLIST456';
    const banlistdb = await BanList.findOne({ _id: id });

    try {
        if(req.query.ip) {
            let ipbanned = false;
            for (let i = 0; i < banlistdb.bannedIpList.length; i++) {
                if (banlistdb.bannedIpList[i].ip == req.query.ip) {
                    ipbanned = true;
                    break;
                } else {
                    ipbanned = false;
                }
            }
    
            if(!ipbanned) {
                return res.status(201).send({
                    success: false,
                    message: 'Ez az IP nincs bannolva.',
                    banned: true
                });
            } else {
                await BanList.updateOne({ _id: id }, { $pull: { bannedIpList: { ip: req.query.ip } }}, { safe: true, multi: true });
    
                return res.status(201).send({
                    success: true,
                    message: 'Sikeres unbannolás.',
                });
            }
        } else if(req.query.id) {
            let idbanned = false;
            for (let i = 0; i < banlistdb.bannedUserList.length; i++) {
                if (banlistdb.bannedUserList[i].user == req.query.id) {
                    idbanned = true;
                    break;
                } else {
                    idbanned = false;
                }
            }
    
            if(!idbanned) {
                return res.status(201).send({
                    success: false,
                    message: 'Ez az ID nincs bannolva.',
                    banned: true
                });
            } else {
                await BanList.updateOne({ _id: id }, { $pull: { bannedUserList: { user: req.query.id } }}, { safe: true, multi: true });
    
                return res.status(201).send({
                    success: true,
                    message: 'Sikeres unbannolás.',
                });
            }
        }
    } catch(err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
});

/**
 * @route DELETE users/delete/{userId}
 * @desc Felhasználó törlés
 * @access Privát
 */

router.delete('/delete/:id', middleware.isLoggedIn, middleware.isTheOwner, async (req, res) => {
    try {
        await User.findByIdAndDelete({ _id: req.params.id });

        return res.send({
            success: true,
            message: 'Sikeres törlés.'
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
});

/**
 * @route GET users/user/{id&username}
 * @desc Felhasználó adatai
 * @access Publikus
*/

router.get('/user/:username', async (req, res) => {
    let user;
    if (req.params.username.match(/^[0-9a-fA-F]{24}$/)) {
        user = await User.findOne({ _id: req.params.username }).select(['-profile.password', '-profile.ipList']);
    } else {
        user = await User.findOne({ 'profile.username': req.params.username }).select(['-profile.password', '-profile.ipList']);
    }

    try {
        if(!user) return res.status(404).send({
            success: false,
            message: 'Nem létezik ilyen felhasználó a megadott paraméterekkel.'
        });

        return res.send({
            success: true,
            user: user
        });
    } catch (err) {
        return res.status(404).send({
            success: false,
            error: err.message
        });
    }
});

/**
 * @route GET users/currentuser
 * @desc Felhasználó adatai
 * @access Privát
 */

router.get('/currentuser', middleware.isLoggedIn, (req, res) => {
    return res.send({
        success: true,
        user: req.user
    });
});

module.exports = router;
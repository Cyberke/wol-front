const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/UserSchema');

function passportAuthenticate(callback) {
  function hack(req, res, next) {
    passport.authenticate('jwt', function (err, user, info) {
      if (err) return res.status(404).send({
        success: false,
        message: 'Ismeretlen hiba: ' + err
      });

      if (!user) return res.status(401).send({
        success: false,
        message: 'Kérlek előbb jelentkezz be.'
      });

      req.user = user;
      return callback(req, res, next);
    })(req, res, next);
  }

  return hack;
}

middleware = {};

middleware.isLoggedIn = passportAuthenticate((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET_KEY, function (err, decode) {
      User.findOne({
        _id: decode.id
      })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({
              success: false,
              message: err
            });
          } else {
            next();
          }
        })
    });
  } else {
    res.status(401).send({
      success: false,
      message: 'Kérlek előbb jelentkezz be.'
    });
  }
});

middleware.login = async (req, res, next) => {
  const user = await User.findOne({ 'profile.username': req.body.username }) || await User.findOne({ 'profile.email': req.body.username });

  if (!user) {
    return res.status(404).send({
      success: false,
      message: 'A megadott felhasználónév vagy email cím nem létezik.'
    });
  }

  if (req.body.username.length < 3 || req.body.username.length > 20) {
    return res.status(404).send({
      success: false,
      message: 'A felhasználónév 3 és 20 karakter között kell álljon.'
    });
  }

  if (req.body.password.length < 6) {
    return res.status(404).send({
      success: false,
      message: 'A jelszó minimum 6 karakterből kell álljon.'
    });
  }

  next();
};

middleware.register = async (req, res, next) => {
  const isUsernameTaken = await User.findOne({ 'profile.username': req.body.username });
  const isEmailTaken = await User.findOne({ 'profile.email': req.body.email });

  if (isUsernameTaken) {
    return res.status(404).send({
      success: false,
      message: 'A megadott felhasználónév már foglalt.'
    });
  }

  if (isEmailTaken) {
    return res.status(404).send({
      success: false,
      message: 'A megadott email cím már foglalt.'
    });
  }

  if (req.body.username.length < 3 || req.body.username.length > 20) {
    return res.status(404).send({
      success: false,
      message: 'A felhasználónév 3 és 20 karakter között kell álljon.'
    });
  }

  if (req.body.email.length < 6 || req.body.email.length > 30) {
    return res.status(404).send({
      success: false,
      message: 'Az email cím 6 és 30 karakter között kell álljon.'
    });
  }

  function isEmail(str) {
    const pattern = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$');
    return !!pattern.test(str);
  }

  if(!isEmail(req.body.email)) {
    return res.status(404).send({
      success: false,
      message: 'A megadott email cím nem megfelelő. (pelda@wolimby.hu)'
    });
  }

  if (req.body.password.length < 6) {
    return res.status(404).send({
      success: false,
      message: 'A jelszó minimum 6 karakterből kell álljon.'
    });
  }

  next();
};

middleware.patchUser = async (req, res, next) => {
  const userToPatch = await User.findOne({ _id: req.params.id });
  const isUsernameTaken = await User.findOne({ 'profile.username': req.body.username });
  const isEmailTaken = await User.findOne({ 'profile.email': req.body.email });

  if(req.body.username) {
    if (isUsernameTaken && userToPatch.profile.username != req.body.username) {
      return res.status(404).send({
        success: false,
        message: 'A megadott felhasználónév már foglalt.'
      });
    }
  }

  if(req.body.email) {
    if (isEmailTaken && userToPatch.profile.email != req.body.email) {
      return res.status(404).send({
        success: false,
        message: 'A megadott email cím már foglalt.'
      });
    }
  }

  if(req.body.password) {
    if (req.body.password.length < 6) {
      return res.status(404).send({
        success: false,
        message: 'A jelszó minimum 6 karakterből kell álljon.'
      });
    }
  }

  if(req.body.username) {
    if (req.body.username.length < 3 || req.body.username.length > 20) {
      return res.status(404).send({
        success: false,
        message: 'A felhasználónév 3 és 20 karakter között kell álljon.'
      });
    }
  }

  if(req.body.name) {
    if (req.body.name.length < 4 || req.body.name.length > 20) {
      return res.status(404).send({
        success: false,
        message: 'A név 4 és 20 karakter között kell álljon.'
      });
    }
  }

  if(req.body.email) {
    if (req.body.email.length < 6 || req.body.email.length > 30) {
      return res.status(404).send({
        success: false,
        message: 'Az email cím 6 és 30 karakter között kell álljon.'
      });
    }
  }

  if(req.body.biography) {
    if (req.body.biography.length < 4 || req.body.biography.length > 30) {
      return res.status(404).send({
        success: false,
        message: 'A biográfia 4 és 20 karakter között kell álljon.'
      });
    }
  }

  next();
};

middleware.isTheOwner = (req, res, next) => {
  if (req.user._id != req.params.id) {
    return res.status(404).send({
      success: false,
      message: 'A megadott ID nem egyezik meg a te ID-del.'
    });
  }

  next();
};

module.exports = middleware;
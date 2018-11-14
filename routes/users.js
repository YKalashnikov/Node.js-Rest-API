const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const auth = require('../auth');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = server => {
     //Register User
     server.post('/register', (req, res, next) => {
         const { email, password } = req.body;

         const user = new User({
             email, 
             password
         });
         bcrypt.genSalt(10, (error, salt) => {
             bcrypt.hash(user.password,  salt, async (error, hash) => {
                 //Hash password
                 user.password = hash;
                 //Save user
                 try {
                     const newUser = await user.save();
                     res.send(201);
                     next();
                 } catch(error) {
                    return next(new errors.InternalError(error.message));
                 }
             });
         })
     })
     server.get('/register/all', async (req, res, next) => {
        try {
            const users = await User.find({});
            res.send(users);
        }
        catch (err) {
            return next(new errors.InvalidContentError(err));
        }
     })
     server.post('/auth', async function(req, res, next) {
        const { email, password } = req.body;

        try {
            const user = await auth.authenticate(email, password);
            //Create token JWT
            const token = jwt.sign(user.toJSON(),config.JWT_SECRET, {expiresIn:'5m'});

            const {iat, exp} = jwt.decode(token);
            res.send({iat, exp, token})
            next();
        }catch(err) {
            return next(new errors.UnauthorizedError(err));
        }
     })
}
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // ensure bcrypt is installed
const Users = require('../model/Users'); // adjust the path to your Users model
const secret = "12651";

const authController = {
    login: async (request, response) => {
        try {
            const { username, password } = request.body;

            const data = await Users.findOne({ email: username });
            if (!data) {
                return response.status(401).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, data.password);
            if (!isMatch) {
                return response.status(401).json({ message: 'Invalid credentials' });
            }

            const userDetails = {
                id: data._id,
                name: data.name,
                email: data.email,
            };

            const token = jwt.sign(userDetails, secret, { expiresIn: '1h' });

            response.cookie('jwtToken', token, {
                httpOnly: true,
                secure: false, 
                sameSite: 'Lax',
                path: '/',
            });

            return response.json({ message: 'User authenticated', userDetails });
        } catch (error) {
            console.error('Error during login:', error);
            return response.status(500).json({ message: 'Internal server error' });
        }
    },

    logout: (request, response) => {
        response.clearCookie('jwtToken');
        response.json({ message: 'User logged out successfully' });
    },

    isUserLoggedIn: (request, response) => {
        const token = request.cookies.jwtToken;
        if (!token) {
            return response.status(401).json({ message: 'Unauthorized access' });
        }

        jwt.verify(token, secret, (error, userDetails) => {
            if (error) {
                return response.status(401).json({ message: 'Unauthorized access' });
            }
            return response.json({ userDetails });
        });
    },
    register:async (request,response)=>{
        try{
            const{username,password,name}=request.body;
             const data = await Users.findOne({ email: username });
                if (data) {
                return response.status(401).json({ message: 'User exist with given email' });
            }
            const encryptedPassword = await bcrypt.hash(password, 10);
            const user=new Users({ 
                email: username,
                password: encryptedPassword,
                name: name
            });
            await user.save();
            response.status(200).json({ message: 'User registered successfully' });

        }catch(error){
            console.error('Error during registration:', error);
            return response.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = authController;

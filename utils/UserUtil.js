const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}
async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}
async function register(req, res) {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if (!email.includes('@') || !email.includes('.') || password.length < 6) {
            return res.status(400).json({ message: 'Validation error' });
        }

        const newUser = new User(username, email, password);
        const updatedUsers = await writeJSON(newUser, 'utils/users.json');
        
        return res.status(201).json(updatedUsers);
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function login(req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const allUsers = await readJSON('utils/users.json');

        for (var i = 0; i < allUsers.length; i++) {
            var currUser = allUsers[i];
            if (currUser.username == username && currUser.password == password) {
                // Generate JWT token
                const token = jwt.sign({ username: currUser.username }, 'your_secret_key', { expiresIn: '1h' });
                return res.status(201).json({ message: 'Login successful!', token: token });
            }
        }

        return res.status(401).json({ message: 'Invalid credentials!' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}





module.exports = {
    readJSON, writeJSON, register, login, 
};
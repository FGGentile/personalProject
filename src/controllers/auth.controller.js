import User from '../models/user.model.js'
import brcypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'

export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const passwordHash = await brcypt.hash(password, 10)
        const newUser = new User({
            username,
            password: passwordHash
        })
        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id })
        res.cookie('token', token)
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {

        const userFound = await User.findOne({ username: username });
        if (!userFound) return res.status(400).json({ msg: 'User not found' });

        const isMatch = await brcypt.compare(password, userFound.password)

        if (!isMatch) return res.status(400).json({ msg: 'Wrong password' });

        
        const token = await createAccessToken({ id: userFound._id })
        res.cookie('token', token)
        res.json({
            id: userFound._id,
            username: userFound.username,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}



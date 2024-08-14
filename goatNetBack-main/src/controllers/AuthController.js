import bcrypt from 'bcrypt';
import { findUserByEmail } from '../models/User.js';
import { createUser } from '../models/User.js';
import { updateToken, findUserByTokenWithRelations } from '../models/User.js';
import jwt from 'jsonwebtoken';


//Entrar
export const signin = async (req, res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if (!user) {
            return res.status(500).json({
                error: "Email or password invalid!",
            });
        }

        const match = await bcrypt.compare(data.password, user.passwordHash)
        if (!match) {
            return res.status(500).json({
                error: "Email or password invalid!",
            });
        }

        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);
        await updateToken(user.id, token);

        res.status(200).json({ userId: user.id, token });
    } catch (error) {
        res.status(500).json({ error: "Failed to log in", message: error.message });
    }
};


//Inscrever-se
export const signup = async (req, res) => {
    try {
        const data = req.body;
        const user = await findUserByEmail(data.email);
        if (user) {
            res.status(500).json({
                error: "Email already exists!",
            });
            return;
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const payload = (Date.now() + Math.random()).toString();
        const token = await bcrypt.hash(payload, 10);

        await createUser({
            name: data.name,
            email: data.email,
            passwordHash,
            token,
            admUser: data.admUser || false,
        });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user', message: error.message })
    }
};




import { findUserByEmail, findUserByTokenWithRelations } from "../models/User.js";


// Informação do usuário
export const info = async (req, res) => {
    try {
        let token = req.body.token;
        if (!token) {
            res.status(500).json({ error: "Token was not provided" });
            return;
        }
        const user = await findUserByTokenWithRelations(token);

        res.status(200).json({
            name: user.name,
            email: user.email,
            password: user.passwordHash,
            admin: user.admUser
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to get info of the user",
            message: error.message,
        })
    }
}

export const getByEmail = async (req, res) => {
    try {
        let email = req.params.email;
        const user = await findUserByEmail(email);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to get info of the user",
            message: error.message,
        })
    }
}

export const updateUserName = async (req, res) => {
    try {
        const {email, name} = req.body;

        await prisma.user.update({
            where : {email},
            data: { name }
        })
    }
    catch (error) {
        res.status(500).json({
            error: "Failed to update user",
            message: error.message,
        })
    }
}
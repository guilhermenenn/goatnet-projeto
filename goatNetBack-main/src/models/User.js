import { prisma } from "../../config/prisma.js";

export const createUser = async(data) => {
    try {
    return await prisma.user.create({
        data:{
            name: data.name,
            email: data.email,
            passwordHash: data.passwordHash,
            token: data.token,
            admUser: data.admUser || false, //definindo como falso -- configurar no front
        },
    })}
    catch (error) {
        throw new Error(`Failed to create user: ${error.message}`);
    } ;
};


export const findUserByEmail = async (email) => {
    try {
        return await prisma.user.findUnique({
            where: {
                email: email,
            },
            include: {
                userGames: true, // Incluir relacionamentos de jogos do usuário, se necessário
            },
        });
    } catch (error) {
        throw new Error(`Failed to find user: ${error.message}`);
    } 
};


export const findAllUsers = async() => {
    try {
    return await prisma.user.findMany()}
    catch (error) {
        throw new Error(`Failed to find all users: ${error.message}`);
    };
};


export const updateToken = async(userId,token) =>{
    try {
    return await prisma.user.update({
        where: {id:userId},
        data:{
            token,
        }
    })} catch (error) {
        throw new Error(`Failed to update token: ${error.message}`);
    };
};

export const findUserByTokenWithRelations = async(token) => {
    try {
    return await prisma.user.findFirst({
        where: { token },
        include: {
            userGames: true,
        }
    })} catch (error) {
        throw new Error(`Failed to find user by token with relations: ${error.message}`);
    } ;
};


export const findUserByToken = async(token) => {
    try {
    return await prisma.user.findFirst({
        where: { token },
    })} catch (error) {
        throw new Error(`Failed to find user by token: ${error.message}`);
    };
};
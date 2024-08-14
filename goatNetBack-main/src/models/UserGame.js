import { prisma } from "../../config/prisma.js"

export const createUserGames = async (userId, gameId) => {
    try {
        return await prisma.userGames.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                game: {
                    connect: {
                        id: gameId,
                    },
                },
            }
        })
    } catch (error) {
        throw new Error(`Failed to create user game: ${error.message}`);
    }
};

//verificando se o game existe na Lista do usuário
export const isGameInUserList = async (userId, gameId) => {
    try {

        return await prisma.UserGames.findFirst({
            where: {
                userId: userId,
                gameId: gameId,
            }
        })

    } catch (error) {
        throw new Error(`Failed to check if game is in user's list: ${error.message}`);
    }
}

export const findUserGameById = async (id) => {
    try {
        return await prisma.userGames.findFirst({
            where: { id },
            include: {
                game: true,
                user: true
            },
        });
    } catch (error) {
        throw new Error(`Failed to find user game by Id: ${error.message}`);
    }
};

export const findAllUserGames = async () => {
    try {
        // Busca todos os registros de UserGame para o userId fornecido
        const userGames = await prisma.userGames.findMany({
            select: {
                gameId: true,
                userId: true
            },
        });

        return userGames;
    } catch (error) {
        console.error('Error finding user games:', error);
        throw new Error('Failed to find user games');
    }
};

export const deleteUserGameList = async (id) => {
    try {
        return await prisma.userGames.delete({
            where: {
                id,
            },
        });
    } catch (error) {
        throw new Error(`Failed to delete Game: ${error.message}`);
    }
};


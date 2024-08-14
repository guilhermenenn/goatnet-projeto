import { prisma } from "../../config/prisma.js";

export const createGame = async (data) => {
  try {
    console.log(data)
    console.log('data')
      return await prisma.game.create({
          data: {
              name: data.name,
              categoryId: data.categoryId,
              price: data.price,
              description: data.description,
              images: {
                  create: data.images || [], // Pode não haver imagens
              }
          },
      });
  } catch (error) {
      throw new Error(`Failed to create game: ${error.message}`);
  } 
};

export const findAllGame = async (filters = {}) => {
    try {
        const { categoryId } = filters
        const whereClause = {
            ...(categoryId  && { category: { id: categoryId }}),
        }
        return await prisma.game.findMany({
            where: whereClause,
            include: {
                images: true,
            },
        })
    } catch (error) {
        throw new Error(`Failed to get Game: ${error.message}`)
    }
}

export const findGameById = async (id) => {
    try {
        return await prisma.game.findFirst({
            where: { id },
            include: { images : true },
        })
    } catch (error) {
        throw new Error(`Failed to get Game by Id: ${error.message}`)
    }
}

export const updateGame = async (id, data) => {
    try {
      return await prisma.game.create({
        data: {
            name: data.name,
            categoryId: data.categoryId,
            price: data.price,
            description: data.description,
            images: {
                create: data.images || [], // Pode não haver imagens
            }
        },
    });
    } catch (error) {
      throw new Error(`Failed to update Game: ${error.message}`);
    }
  };
  
  export const deleteGame = async (id) => {
    try {
      return await prisma.game.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new Error(`Failed to delete Game: ${error.message}`);
    }
  };
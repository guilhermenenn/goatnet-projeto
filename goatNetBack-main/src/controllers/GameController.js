import { findAllCategories, findCategoryById, findCategoryByName } from "../models/Category.js"
import { randomUUID } from "node:crypto"
import jimp from "jimp"
import { createGame, findGameById, findAllGame, deleteGame } from "../models/Game.js"
import { createUserGames, findAllUserGames } from "../models/UserGame.js"
import { findUserByEmail, findUserByTokenWithRelations } from "../models/User.js"

// --------------------------------------------------------

const addImage = async (file) => {
  let NewName = `${randomUUID()}.png`
  let imagePath = `./public/media/${NewName}`;
  await file.mv(imagePath); // Salva a imagem usando express-fileupload
  let tmpImage = await jimp.read(imagePath);
  tmpImage.cover(500, 500).quality(80).write(imagePath)
  return `${process.env.BASE}/media/${NewName}`;
}


// Obter as categorias dos jogos
export const getCategories = async (req, res) => {
  try {
    const categories = await findAllCategories();
    res.status(200).json({ categories });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get categories", message: error.message });
  }
};

export const addUserGame = async (req, res) => {

  const {email, gameId} = req.body

  const user = await findUserByEmail(email);

  if (!user || !gameId) {
    return res.status(400).json({ error: 'userId and gameId are required' });
  }

  try {
    const userGame = await createUserGames(user.id, gameId);
    return res.status(201).json(userGame);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user game:", message: error.message });
  }
};



// Criar anúncio do JOGO
export const createAdGame = async (req, res) => {
  try {
    let { name, price, description, category } = req.body;
    const images = req.files?.images || [];
    console.log('Received Image: ', images)

    const categoryId = await findCategoryByName(category);
    if (!categoryId) {
      return res.status(400).json({ error: "Category not found" });
    }

    const data = {
      name,
      categoryId: categoryId.id,
      price: parseFloat(price.match(/\d|,/g).join("").replace(",", ".")),
      description,
      images: [],
    }


    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        let url = await addImage(image);
        data.images.push({ url, default: i === 0 }); // Mark the first image as default
      }
    } else {
      // Default image if no image is provided
      let url = `${process.env.BASE}/media/default.png`;
      data.images.push({
        url, default: true,
      });
    }
    const info = await createGame(data);

    return res.status(201).json({ info });

  } catch (error) {
    res.status(500).json({ error: "Failed to create game ad", message: error.message })
  }
}

export const delGame = async (req, res) => {
  try {
    let { id } = req.params;
    const gameId = parseInt(id, 10);

    await prisma.image.deleteMany({
      where: {
        gameId: gameId
      }
    });

    await prisma.userGames.deleteMany({
      where: {
        gameId: gameId
      }
    });

    const info = await deleteGame(gameId);

    return res.status(200).json({ message: `Game with ID ${gameId} successfully deleted`, info });

  } catch (error) {
    res.status(500).json({ error: "Failed to delete game", message: error.message })
  }
}

// FUNÇÃO DA LISTA DE JOGOS DO SITE
export const getList = async (req, res) => {
  try {
    let { category } = req.query;
    let filters = { status: true };
    if (category) {
      const categoryId = await findCategoryByName(category);
      if (categoryId) filters.categoryId = categoryId.id;
    }
    const gameData = await findAllGame(filters);
    let games = [];
    for (let i in gameData) {
      let images = gameData[i].images?.map((img) => 
        img.url.startsWith('http') 
          ? img.url 
          : `${process.env.BASE}/media/${img.url}`
      ) || [];

      if (images.length === 0) {
        images.push(`${process.env.BASE}/media/default.png`);
      }

      games.push({
        id: gameData[i].id,
        name: gameData[i].name,
        price: gameData[i].price,
        description: gameData[i].description,
        category: gameData[i].categoryId,
        images,
      });
    }

    return res.status(200).json({ games });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get list of games", message: error.message });
  }
};


// FUNÇÃO BIBLIOTECA - Lista de Jogos do Usuário
export const getBiblioteca = async (req, res) => {
  try {
    let token = req.body.token;
    const user = await findUserByTokenWithRelations(token);

    const gameData = await findAllUserGames(user.id);

    let games = [];
    for (let i in gameData) {
      let image;
      let defaultImg = gameData[i].images?.find((e) => e.default);

      if (defaultImg) image = `${process.env.BASE}/media/${defaultImg.url}`;
      else image = `${process.env.BASE}/media/default.png`;
      games.push({
        id: gameData[i].id,
        name: gameData[i].name,
        price: gameData[i].price,
        description: gameData[i].description,
        category: gameData[i].categoryId,
        image,
      });
    }
    return res.status(200).json({ games });


  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get library", message: error.message });
  }
};

// FAZER A FUNÇÃO DE mostrar as informações do jogo 
export const getItemGame = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "O ID não foi fornecido" });
    }

    const gameId = parseInt(id); // Converte o ID para um número inteiro

    const game = await findGameById(gameId);

    if (!game) {
      return res.status(404).json({ error: "Jogo não encontrado" });
    }

    const images = game.images.map(image => `${process.env.BASE}/media/${image.url}`);

    const category = await findCategoryById(game.categoryId);

    return res.status(200).json({
      id: game.id,
      name: game.name,
      price: game.price,
      description: game.description,
      category,
      images,
    });
  } catch (error) {
    console.error(`Erro ao buscar jogo: ${error.message}`);
    return res.status(500).json({ error: "Erro interno ao buscar jogo" });
  }
};

export const getAllUserGame = async (req, res) => {
    try {
        const userGames = await findAllUserGames();
        res.status(200).json(userGames);
    } catch (error) {
        console.error('Error getting all user games:', error);
        res.status(500).json({ message: 'Failed to get user games' });
    }
};

export const getUsersWithGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    // Consultar a tabela `userGames` para obter os IDs dos usuários que possuem o jogo
    const userGames = await prisma.userGames.findMany({
      where: {
        gameId: parseInt(gameId),
      },
      select: {
        userId: true, // Seleciona apenas os IDs dos usuários
      },
    });

    // Extrair os IDs dos usuários
    const userIds = userGames.map(userGame => userGame.userId);

    res.status(200).json({ userIds });
  } catch (error) {
    console.error('Erro ao obter IDs dos usuários:', error);
    res.status(500).json({ error: 'Falha ao obter IDs dos usuários' });
  }
};
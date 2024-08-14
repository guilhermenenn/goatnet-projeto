import { Router } from "express";
import { getCategories, createAdGame, getItemGame, getList, getBiblioteca, addUserGame, getAllUserGame, delGame, getUsersWithGame } from "../controllers/GameController.js";

const router = Router()


router.get('/categories', getCategories);
router.post('/game/add', createAdGame);
router.post('/usergame/add', addUserGame);
router.get('/usergames', getAllUserGame);
router.get('/game/:id', getItemGame)
router.delete('/game/:id', delGame)
router.get('/games/list', getList)
router.get('/biblioteca', getBiblioteca)
router.get('/games/users/:gameId', getUsersWithGame)

//Enviando imagens, será POST
//router.post('/ad/:id', authPrivate, update)

export default router;
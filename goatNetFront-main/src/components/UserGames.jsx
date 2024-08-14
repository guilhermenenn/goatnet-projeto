import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OlxApi from "../helpers/OlxApi";
import AdGame from "./AdGame";
import { returnEmail } from "../helpers/authHandlers";
import Modal from "./Modal";

const UserGames = () => {

    const api = OlxApi();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [gameList, setGameList] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedGame, setSelectedGame] = useState(null);

    const openModal = (game) => setSelectedGame(game);
    const closeModal = () => setSelectedGame(null);


    useEffect(() => {
        const getGamesList = async () => {
            setLoading(true);

            const user = await api.getUserByEmail(returnEmail())
            const json = await api.getGames({}, navigate);
            const userGameIds = user.userGames.map(ug => ug.gameId);
            const filteredGames = json.games.filter(game => userGameIds.includes(game.id));
            const clist = await api.getCategories(navigate);

            const gamesWithCategoryName = filteredGames.map(game => {
                const category = clist.find(c => c.id === game.category);
                return {
                    ...game,
                    categoryName: category ? category.name : 'Categoria não encontrada'
                };
            });

            setGameList(gamesWithCategoryName);
        };
        getGamesList();
    }, []);

    useEffect(() => {
        const getCategories = async () => {
            const catList = await api.getCategories(navigate);
            setCategories(catList);
        };
        getCategories();
    }, []);


    return (

        <>
            <div className="grid grid-cols-4 gap-4 px-4 text-center py-2">
                {gameList.map((game) => (
                    <AdGame
                        key={game.id}
                        data={game}
                        onClick={() => openModal(game)} // Abre o modal com o jogo selecionado
                    />
                ))}
                {selectedGame && (
                    <Modal
                        game={selectedGame}
                        onClose={closeModal} // Fecha o modal
                    />
                )}
            </div>
        </>
    );
};

export default UserGames;
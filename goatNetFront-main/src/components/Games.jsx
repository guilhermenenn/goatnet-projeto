import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdGame from "./AdGame";
import Modal from "./Modal";
import useGames from "../hooks/useGames";

const Games = ({ selectedCategories, searchTerm }) => {

    const navigate = useNavigate();
    const { gameList, loading, fetchGames } = useGames(navigate);

    const [selectedGame, setSelectedGame] = useState(null);
    const openModal = (game) => setSelectedGame(game);
    const closeModal = () => setSelectedGame(null);

    useEffect(() => {
        const handleStorageChange = () => {
            if (localStorage.getItem('newGameAdded') === 'true') {
                localStorage.removeItem('newGameAdded'); // Limpar o valor
                fetchGames(); // Atualizar a lista de jogos
            } else if (localStorage.getItem('gameDeleted') === 'true') {
                localStorage.removeItem('gameDeleted'); // Limpar o valor
                fetchGames(); // Atualizar a lista de jogos
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [fetchGames]);

    if (loading) return <div>Loading...</div>;

    const filteredGames = gameList.filter(game =>
        (selectedCategories.length === 0 || selectedCategories.includes(game.categoryName)) &&
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrar pelo termo de pesquisa
    );

    return (

        <>
            <div className="grid grid-cols-4 gap-4 px-4 text-center py-2">
                {filteredGames.map((game) => (
                    <AdGame onClick={() => openModal(game)} key={game.id} data={game} />
                ))}
                {selectedGame && (
                    <Modal
                        game={selectedGame}
                        onClose={closeModal}
                    />
                )}
            </div>
        </>
    );
};

export default Games;
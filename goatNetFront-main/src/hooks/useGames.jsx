import { useState, useEffect } from "react";
import OlxApi from "../helpers/OlxApi";

const useGames = (navigate) => {
    const [gameList, setGameList] = useState([]);
    const [loading, setLoading] = useState(true);

    const api = OlxApi();

    const fetchGames = async () => {
        setLoading(true);
        const json = await api.getGames({}, navigate);
        const clist = await api.getCategories(navigate);

        const gamesWithCategoryName = json.games.map(game => {
            const category = clist.find(c => c.id === game.category);
            return {
                ...game,
                categoryName: category ? category.name : 'Categoria não encontrada'
            };
        });

        setGameList(gamesWithCategoryName);
        setLoading(false);
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return { gameList, loading, fetchGames };
};

export default useGames;

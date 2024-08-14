import { useState, useEffect } from 'react';
import OlxApi from '../helpers/OlxApi';
import { returnEmail } from '../helpers/authHandlers';

const useCart = () => {
    const api = OlxApi();

    const [cart, setCart] = useState([]);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const updateCart = () => {
            const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
            setCart(savedCart);
            setCartItemCount(savedCart.length);
        };

        updateCart();

        const handleStorageChange = (e) => {
            if (e.key === 'cart') {
                updateCart();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const getTotal = () => {
        return cart.reduce((total, item) => total + item.price, 0);
    };

    const cleanCartWhenLogin = async () => {
        const email = returnEmail();
        if (email) {
            try {
                // Obter o usuário e os IDs dos jogos que ele já possui
                const user = await api.getUserByEmail(email);
                const userGameIds = user.userGames.map(ug => ug.gameId);

                // Filtrar os jogos que o usuário já possui
                const updatedCart = cart.filter(item => !userGameIds.includes(item.id));

                // Atualizar o localStorage e o estado do carrinho
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                setCart(updatedCart);
                setCartItemCount(updatedCart.length);
            } catch (error) {
                console.error('Erro ao limpar o carrinho para o usuário logado:', error);
            }
        }
    };

    return { cart, cartItemCount, getTotal, cleanCartWhenLogin  };
};

export default useCart;

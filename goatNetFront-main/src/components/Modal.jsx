import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { returnEmail } from "../helpers/authHandlers";
import OlxApi from "../helpers/OlxApi";
import { checkAdm } from '../helpers/authHandlers';
import Carousel from "./Carousel";

const Modal = ({ game, onClose }) => {
    const api = OlxApi();

    const navigate = useNavigate();
    const [isPurchased, setIsPurchased] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [images, setImages] = useState([game.image]);

    const modalRef = useRef(null);

    useEffect(() => {
        if (game.images) {
            setImages(game.images);
        }
    }, [game.images]);

    useEffect(() => {

        const checkIfPurchased = async () => {
            const email = returnEmail();

            try {
                const user = await api.getUserByEmail(email, navigate);

                const userGames = user.userGames || [];
                const isGamePurchased = userGames.some(userGame => userGame.gameId === game.id);

                setIsPurchased(isGamePurchased);

            } catch (error) {
                console.error('Erro ao verificar o jogo:', error);
            }
        };

        const fetchAdminStatus = async () => {
            try {
                const status = await checkAdm();
                setIsAdmin(status);
            } catch (error) {
                console.error('Erro ao obter o status de admin:', error);
            }
        };

        checkIfPurchased();
        fetchAdminStatus();
    }, [game.id, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleBuy = () => {
        // Adiciona o item ao carrinho
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Verifica se o item já está no carrinho
        const itemExists = cart.some(item => item.id === game.id);

        if (!itemExists) {
            if (cart.length >= 5) {
                alert('O carrinho já está cheio. Máximo de 5 itens.');
                return;
            }
            cart.push(game);
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Redireciona para a página do carrinho
        navigate('/cart');
    };

    const handleAddToCart = () => {
        // Obtemos o carrinho do localStorage, ou um array vazio se não existir
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Verifica se o item já está no carrinho
        const isItemInCart = cart.some(item => item.id === game.id);

        if (isItemInCart) {
            alert("Este item já está no carrinho!");
            return;
        }

        if (cart.length >= 5) {
            alert('O carrinho já está cheio. Máximo de 5 itens.');
            return;
        }

        // Adicionamos o novo item ao carrinho
        cart.push(game);

        // Salvamos o carrinho atualizado no localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Fechamos o modal
        onClose();
    };

    const handleDelete = async () => {
        const userIds = await api.getUsersWithGame(game.id);
        const userIdsList = userIds.join(', ');
        let confirmText = ''
        if (userIdsList.length > 0) {
            confirmText = (`Tem certeza de que deseja excluir este jogo?\nUsuários que possuem este jogo: ${userIdsList}`)
        } else {
            confirmText = (`Tem certeza de que deseja excluir este jogo?\nNenhum usuário possui este jogo.`)
        }
        if (window.confirm(confirmText)) {
            try {

                await api.deleteGame(game.id);
                alert('Jogo excluído com sucesso.');

                localStorage.setItem('gameDeleted', 'true');
                window.dispatchEvent(new Event('storage'));

                onClose();
            } catch (error) {
                console.error('Erro ao excluir o jogo:', error);
                alert('Falha ao excluir o jogo.');
            }
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black opacity-50 z-40" />
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    className="border border-slate-400 grid grid-cols-9 rounded-md gap-24 bg-zinc-800 bg-blend-darken p-4 max-w-6xl mx-4"
                    ref={modalRef}
                >
                    <div className='col-span-5 col-start-2'>
                        <div className='flex justify-start py-2 text-2xl font-bold my-2'>
                            {game.name}
                        </div>
                        <div className=''>
                            <Carousel images={images} autoPlayInterval={5000} />
                        </div>
                        <div className='text-xl text-left my-6 overflow-auto' style={{ maxHeight: '200px' }}>
                            {game.description}
                        </div>
                        <div className='mx-2 text-left'>
                            <div className='text-zinc-400'>
                                Gêneros
                            </div>
                            <div>
                                {game.categoryName}
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-3 col-span-3 mt-14'>
                        <div className='col-span-2'>
                            <a className='py-2 flex justify-center'>
                                <img src={game.images[0]} alt="img1" className='rounded-md h-5/6 w-full' />
                            </a>
                            <div className='text-xl text-left my-2'>
                                R$ {game.price}
                            </div>
                            {!isPurchased && (
                                <>
                                    <button onClick={handleBuy} className='rounded-md text-center py-2 my-1 bg-indigo-950 w-full text-xl hover:opacity-75'>
                                        Comprar
                                    </button>
                                    <button onClick={handleAddToCart} className='rounded-md text-center py-2 my-1 w-full text-xl border hover:opacity-75'>
                                        Adicionar ao Carrinho
                                    </button>
                                </>
                            )}
                            {isPurchased && (
                                <div className='text-green-500 text-xl font-bold'>
                                    Já adquirido
                                </div>
                            )}
                            {isAdmin && (
                                <button
                                    onClick={handleDelete}
                                    className='rounded-md bg-red-600 text-white py-2 px-4 hover:bg-red-700 float-end mt-24'
                                >
                                    Excluir Jogo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
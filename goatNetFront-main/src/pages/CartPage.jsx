import { useState, useEffect } from "react";
import Cart from "../components/Cart";
import Navbar from "../components/Navbar";
import useCart from "../hooks/useCart";
import { returnEmail } from "../helpers/authHandlers";

const CartPage = () => {

    const { cart, cartItemCount, getTotal } = useCart();
    const [total, setTotal] = useState(0);

    // Função para atualizar o total quando o carrinho muda
    const updateTotal = (newTotal) => {
        setTotal(newTotal);
    };

    const handleClearCart = () => {
        // O Cart component tem a funcionalidade para limpar o carrinho
        // Quando o carrinho é limpo, ele notifica a página para atualizar o total
        localStorage.removeItem('cart');
        setTotal(0);
        window.location.reload();
    };

    const handlePurchase = async () => {
        const email = returnEmail(); // Substitua com a lógica para obter o e-mail do usuário logado
        
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        if(!email){
            alert('Faça login para fazer compras')
            return;
        }

        try {
            for (const item of cart) {
                const response = await fetch('http://localhost:3001/usergame/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, gameId: item.id }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Erro ao adicionar item ao banco de dados:', errorData);
                    alert('Falha ao concluir a compra. Verifique o console para mais detalhes.');
                    return;
                }
            }

            // Limpa o carrinho após a compra
            localStorage.removeItem('cart');
            setTotal(0);
            alert('Jogos comprados com sucesso!');
        } catch (error) {
            console.error('Erro ao concluir a compra:', error);
            alert('Falha ao concluir a compra. Verifique o console para mais detalhes.');
        }
    };

    return (
        <div>
            <Navbar />
            <section className="bg-gray-900 py-4">
                <div className="flex flex-col px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full rounded-lg shadow border md:mt-0 xl:p-0 bg-gray-800 border-gray-700">
                        <div className="flex justify-between items-center px-6 space-y-4 md:space-y-6 sm:px-8 py-4 sm:py-6">
                            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Carrinho ({cartItemCount} item{cartItemCount !== 1 ? 's' : ''})
                            </h1>
                            <button
                                onClick={handleClearCart}
                                className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 "
                            >
                                Limpar Carrinho
                            </button>
                        </div>
                        <Cart onTotalChange={updateTotal} />
                        <div className="my-2">
                            <a className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white px-6 sm:px-8">
                                R$ {total.toFixed(2)}
                            </a>
                            <button type="submit" onClick={handlePurchase} className="float-end w-1/12 text-white bg-primary-600 hover:bg-primary-700 font-medium rounded-lg text-sm mb-2 mr-8 px-5 py-2.5 text-center">
                                Concluir compra
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CartPage;
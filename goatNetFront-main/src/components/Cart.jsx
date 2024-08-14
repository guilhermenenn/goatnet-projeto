import React, { useEffect, useState } from 'react';

const Cart = ({ onTotalChange }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Carregar o carrinho do localStorage
        const loadCart = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(cart);
            onTotalChange(cart.reduce((total, item) => total + parseFloat(item.price), 0));
        };

        loadCart();
    }, [onTotalChange]);

    const handleRemoveItem = (index) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        onTotalChange(updatedCart.reduce((total, item) => total + parseFloat(item.price), 0));
        window.location.reload();
    };

    return (
        <div className="py-2 px-6 space-y-4 md:space-y-6 sm:px-8">
            {cartItems.length === 0 ? (
                <div className="text-center text-gray-500">Seu carrinho está vazio.</div>
            ) : (
                cartItems.map((item, index) => (
                    <div key={index} className="space-y-4 md:space-y-6 border border-zinc-400 rounded-md grid grid-cols-6">
                        <div className='w-full p-3 flex'>
                            <img src={item.images[0]} alt={item.name} className='rounded-md' />
                        </div>
                        <div>
                            <div className="block mb-2 text-xl font-medium text-white">
                                {item.name}
                            </div>
                            <div className="block py-4 text-xl font-medium text-white">
                                R$ {item.price}
                            </div>
                        </div>
                        <div className='col-start-6 justify-end items-end text-right'>
                            <button
                                onClick={() => handleRemoveItem(index)}
                                className="float-end text-white font-medium rounded-lg text-sm mb-2 mr-4 px-3 py-1.5 text-center bg-primary-600 hover:bg-primary-700">
                                Excluir
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Cart;

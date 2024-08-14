import Navbar from "../components/Navbar";
import logo from "/assets/icon/free-goat-1602254-1358174.webp";
import { Link, useNavigate } from "react-router-dom";
import { doLogin } from "../helpers/authHandlers";
import OlxApi from "../helpers/OlxApi";
import { useState } from "react";
import Footer from "../components/Footer";
import useCart from '../hooks/useCart';

const Login = () => {
    const api = OlxApi();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { cleanCartWhenLogin } = useCart();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDisabled(true);
        setError('');

        try {
            const json = await api.login(email, password, navigate);

            if (json.error) {
                setError('Email ou senha incorretos!');
                setDisabled(false);
            } else {
                doLogin(json.token, email);
                await cleanCartWhenLogin();
                alert('Login efetuado com sucesso!')
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('An error occurred. Please try again.');
            setDisabled(false);
        }
    };

    return (
        <section className="bg-gray-900">
            <Navbar />
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a className="flex items-center mb-6 text-2xl font-semibold text-white mt-20">
                    <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
                    GOATNET
                </a>
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Entrar em sua conta
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
                                <input type="email" name="email" id="email" disabled={disabled} value={email} onChange={(e) => setEmail(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="email@email.com" required/>
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Senha</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" disabled={disabled} value={password} onChange={(e) => setPassword(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required/>
                            </div>
                            <button type="submit" disabled={disabled} className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">Entrar</button>
                            {error && (
                                <p className="text-sm font-medium text-red-500 mt-2">{error}</p>
                            )}
                            <p className="text-sm font-light text-gray-400">
                                Deseja criar uma conta? <Link to="/signup" className="font-mediu hover:underline text-primary-500">Cadastrar-se</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </section>
    )
}

export default Login;
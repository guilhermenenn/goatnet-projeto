import Navbar from "../components/Navbar";
import logo from "/assets/icon/free-goat-1602254-1358174.webp";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OlxApi from "../helpers/OlxApi";
import { doLogin } from "../helpers/authHandlers";
import Footer from "../components/Footer";


const Cadastro = () => {

    const api = OlxApi();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [admUser] = useState(false);
    const [error, setError] = useState('')
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Confirmação de senha incorreta!');
            return;
        }

        const json = await api.register(
            { name, email, password, admUser },
            navigate
        );
        console.log(json);

        if (json.error) {
            setError(json.error);
        } else {
            doLogin(json.token);
            navigate('/');
        }
    };


    return (
        <section className="bg-gray-900">
            <Navbar />
            <div className="flex flex-col items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-white mt-20">
                    <img className="w-8 h-8 mr-2" src={logo} alt="logo" />
                    GOATNET
                </a>
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                            Crie sua conta
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
                                <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="email@gmail.com" required />
                            </div>
                            <div>
                                <label htmlFor="nome" className="block mb-2 text-sm font-medium text-white">Nome</label>
                                <input type="text" name="nome" id="nome" value={name} onChange={(e) => setName(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Joao Silva" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Senha</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Confirmar Senha</label>
                                <input type="password" name="passwordConfirm" id="passwordConfirm" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required />
                            </div>

                            <button type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">Cadastrar-se</button>
                            {error && (
                                <p className="text-sm font-medium text-red-500 mt-2">{error}</p>
                            )}
                            <p className="text-sm font-light text-gray-400">
                                Deseja entrar em sua conta? <Link to="/signin" className="font-medium hover:underline text-primary-500">Entrar</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </section>
    )
}

export default Cadastro;
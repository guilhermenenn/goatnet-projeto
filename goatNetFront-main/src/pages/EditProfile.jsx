import Navbar from "../components/Navbar";
import logo from "/assets/icon/free-goat-1602254-1358174.webp";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import OlxApi from "../helpers/OlxApi";
import { returnEmail } from "../helpers/authHandlers";
import Footer from "../components/Footer";


const EditProfile = () => {

    const api = OlxApi();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [buttonClass, setButtonClass] = useState('bg-primary-600 hover:bg-primary-700');
    const [buttonText, setButtonText] = useState('Editar Nome');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const userEmail = returnEmail(); // Obtém o email do cookie
            if (userEmail) {
                const userData = await api.getUserByEmail(userEmail);
                if (userData) {
                    setName(userData.name);
                    setEmail(userData.email);
                }
            }
        };
        fetchUserData();
    }, [api]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpar a mensagem de erro antes de enviar
        setButtonClass('bg-green-500');
        setButtonText('Nome editado com sucesso!');
        setTimeout(() => {
            setButtonClass('bg-primary-600 hover:bg-primary-700');
            setButtonText('Editar nome');
        }, 2000);

        try {
            const json = await api.editUser({ name, email }, navigate);
            console.log(json); // Debug: Verifique a resposta da API

            if (json.error) {
                setError(json.error); // Atualizar o estado de erro
            } else {
                setButtonClass('bg-yellow-500'); // Mudar a cor do botão para amarelo
            }
        } catch (err) {
            console.error(err); // Debug: Verifique o erro
            setError('Ocorreu um erro ao editar o perfil.');
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
                            Edite seu Perfil
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
                                <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-900 border-gray-700 placeholder-gray-400 text-white outline-none" placeholder="email@gmail.com" required />
                            </div>
                            <div>
                                <label htmlFor="nome" className="block mb-2 text-sm font-medium text-white">Nome</label>
                                <input type="text" name="nome" id="nome" value={name} onChange={(e) => setName(e.target.value)} className="border sm:text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Joao Silva" required />
                            </div>
                            <button
                                type="submit"
                                className={`w-full ${buttonClass} focus:outline-nonefont-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                            >
                                {buttonText}
                            </button>
                            {error}
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </section>
    )
}

export default EditProfile;
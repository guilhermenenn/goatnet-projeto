import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import logo from "/assets/icon/free-goat-1602254-1358174.webp"
import { Link, useNavigate } from "react-router-dom";
import { doLogout, isLogged } from "../helpers/authHandlers";

const Navbar = () => {

    let logged = isLogged();
    const navigate = useNavigate();

    const handleLogout = () => {
        doLogout();
        navigate('/signin');
    };

    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const content = <>
        <div className="lg:hidden block absolute top-16 w-full left-0 right-0 bg-zinc-950 transition">
            <ul className="text-center text-xl p-20">
                <Link to="/">
                    <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded">Home</li>
                </Link>
                <Link to="/library">
                    <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded">Biblioteca</li>
                </Link>
                <Link to="/signin">
                    <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded">Entrar</li>
                </Link>
                <Link to="/signup">
                    <li className="my-4 py-4 border-b border-slate-800 hover:bg-slate-800 hover:rounded">Cadastrar</li>
                </Link>
            </ul>
        </div>
    </>
    return (
        <nav>
            <div className="h-10vh flex justify-between z-50 text-white lg:py-5 py-4 bg-zinc-950">
                <Link className="flex items-center" to="/">
                    <button className="hover:bg-slate-800 text-white font-bold rounded inline-flex items-center text-3xl h-16 absolute">
                        <img className="h-10 w-10 mr-1" src={logo} alt="logo" />
                        <span>GOATNET</span>
                    </button>
                </Link>
                <div className="lg:flex md:flex lg:flex-1 items-center justify-start font-normal hidden px-8 ml-44">
                    <div className="flex-10">
                        <ul className="flex gap-6 mr-16 text-[18px]">
                            <Link to="/">
                                <li className="hover:text-slate-400 transition border-b-2 border-zinc-950 hover:border-slate-400">Home</li>
                            </Link>
                            {logged && (
                            <Link to="/library">
                                <li className="hover:text-slate-400 transition border-b-2 border-zinc-950 hover:border-slate-400">Biblioteca</li>
                            </Link>
                            )}
                        </ul>
                    </div>
                </div>
                {logged && (
                    <div className="lg:flex md:flex lg:flex-1 items-center justify-end font-normal hidden px-8 ml-44">
                        <div className="flex-10">
                            <ul className="flex gap-6 text-[18px]">
                                <button onClick={handleLogout} className="border rounded-md px-3 border-slate-600">
                                    <li className="hover:text-slate-300 transition">Sair</li>
                                </button>
                                <Link to="/profile" className="bg-gradient-to-r from-slate-500 to-slate-700 px-3 rounded-md">
                                    <li className="hover:text-slate-300 transition">Editar Perfil</li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                )}

                {!logged && (
                    <div className="lg:flex md:flex lg:flex-1 items-center justify-end font-normal hidden px-8 ml-44">
                        <div className="flex-10">
                            <ul className="flex gap-6 text-[18px]">
                                <Link to="/signin" className="border rounded-md px-3 border-slate-600">
                                    <li className="hover:text-slate-300 transition">Entrar</li>
                                </Link>
                                <Link to="/signup" className="bg-gradient-to-r from-slate-500 to-slate-700 px-3 rounded-md">
                                    <li className="hover:text-slate-300 transition">Cadastrar</li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                )}

                <div>
                    {click && content}
                </div>

                <button className="block sm:hidden transition" onClick={handleClick}>
                    {click ? <FaTimes /> : <CiMenuFries />}
                </button>

            </div>
        </nav>
    );
};

export default Navbar;
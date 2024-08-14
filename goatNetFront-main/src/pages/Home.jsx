import Navbar from "../components/Navbar";
import Games from "../components/Games";
import img from "/assets/icon/market-icons-15740-Windows.ico";
import { Link } from "react-router-dom";
import AddGame from "../components/AddGame";
import Footer from "../components/Footer";
import useCart from "../hooks/useCart";
import { useEffect, useState } from "react";
import OlxApi from "../helpers/OlxApi";
import Carousel from "../components/Carousel";




const Home = () => {
    const api = OlxApi();

    const [categoryList, setCategoryList] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [carouselImages, setCarouselImages] = useState([
        // Adicione aqui os caminhos das imagens para o carrossel
        "/assets/images/banner.jpg",
        "/assets/images/aaaa.jpeg",
        "/assets/images/bbbb.jpg"
    ]);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setSelectedCategories(prevCategories =>
            prevCategories.includes(value)
                ? prevCategories.filter(cat => cat !== value)
                : [...prevCategories, value]
        );
    };

    const clearCategories = () => {
        setSelectedCategories([]);
    };

    useEffect(() => {
        const getCategoryList = async () => {
            try {
                const clist = await api.getCategories(); // Atualize conforme a implementação da API
                setCategoryList(clist);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        getCategoryList();
    }, []);

    const toggleCategoryMenu = () => {
        setShowCategoryMenu(prevState => !prevState);
    };

    // Number of categories per column
    const categoriesPerColumn = 5;
    // Split categories into multiple columns
    const splitCategories = () => {
        let columns = [];
        for (let i = 0; i < categoryList.length; i += categoriesPerColumn) {
            columns.push(categoryList.slice(i, i + categoriesPerColumn));
        }
        return columns;
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const { cartItemCount } = useCart();

    return (
        <div>
            <Navbar />
            <AddGame />
            <div className="py-4 px-4 min">
                <Carousel images={carouselImages} /> {/* Substitua a imagem pelo carrossel */}
            </div>
            <div className="px-4 mb-2">
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded grid grid-cols-10 px-2 text-left text-xl">
                    <div className="col-span-2 relative">
                        <button
                            onClick={toggleCategoryMenu}
                            className="w-full bg-gray-600 text-white my-0.5 px-2 rounded-lg flex justify-between items-center"
                        >
                            <span>Categorias</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 transition-transform ${showCategoryMenu ? 'rotate-180' : 'rotate-0'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {showCategoryMenu && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 rounded-lg p-1 border border-gray-600">
                                <button
                                    onClick={clearCategories}
                                    className="w-2/6 bg-slate-600 text-white rounded-lg mb-1"
                                >
                                    Limpar
                                </button>
                                <div className="flex gap-4 max-w-full overflow-auto">
                                    {splitCategories().map((column, columnIndex) => (
                                        <div key={columnIndex} className="flex-1 max-w-xs">
                                            {column.map((category, index) => (
                                                <label key={index} className="flex items-center text-white mb-1 truncate">
                                                    <input
                                                        type="checkbox"
                                                        value={category.name}
                                                        onChange={handleCategoryChange}
                                                        checked={selectedCategories.includes(category.name)}
                                                        className="mr-2"
                                                    />
                                                    {category.name}
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className=" col-start-8 border-2 border-slate-600 rounded-md">
                        <div className='max-w-md mx-auto'>
                            <div className=" flex items-center w-full h-full rounded-lg focus-within:shadow-lg overflow-hidden">
                                <div className="grid place-items-center h-full w-12 text-gray-300 mt-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                <input
                                    className="peer h-full w-full outline-none text-sm text-white pr-2 bg-transparent"
                                    type="text"
                                    id="search"
                                    placeholder="Pesquisar jogos"
                                    value={searchTerm}
                                    onChange={handleSearchChange} />
                                    {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="mr-1 mt-0.5 text-gray-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-start-11">
                        <Link to="/cart" className="hover:opacity-75">
                            <button className="relative h-6 w-7">
                                <img src={img} alt="Carrinho" className="w-full h-full mt-1" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1 py-0.2 mt-1">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="min-h-48">
                <Games selectedCategories={selectedCategories} searchTerm={searchTerm} />
            </div>
            <Footer />
        </div>
    )
}

export default Home;
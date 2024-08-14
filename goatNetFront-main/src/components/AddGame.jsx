import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OlxApi from "../helpers/OlxApi";
import { checkAdm } from '../helpers/authHandlers';

const AddGame = () => {

    const api = OlxApi();
    const modalRef = useRef(null);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [images, setImages] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);


    const navigate = useNavigate();

    const handleClearForm = () => {
        setName('');
        setDescription('');
        setCategory('');
        setPrice('');
        setImages(null);
    };

    useEffect(() => {
        const getCategory = async () => {
            const clist = await api.getCategories(navigate);
            setCategoryList(clist);
        }

        const fetchAdminStatus = async () => {
            try {
                const status = await checkAdm();
                setIsAdmin(status);
            } catch (error) {
                console.error('Erro ao obter o status de admin:', error);
            } finally {
                setLoading(false);
            }
        };

        getCategory();
        fetchAdminStatus();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const fData = new FormData();

        fData.append("name", name);
        fData.append("category", category);
        fData.append("price", price);
        fData.append("description", description);

        if (images) {
            Array.from(images).forEach((image) => {
                fData.append("images", image);
            });
        }

        console.log([...fData])

        const json = await fetch('http://localhost:3001/game/add', {
            method: 'POST',
            body: fData,
        });

        if (json.error) {
            setError(json.error);
        } else {
            toggleModal();
            handleClearForm();
            localStorage.setItem('newGameAdded', 'true');
            window.dispatchEvent(new Event('storage')); // Disparar o evento 'storage'
            alert(`Jogo "${name}" cadastrado com sucesso!`)
        }
    };

    const handleImageChange = (e) => {
        setImages(e.target.files); // Armazena os arquivos selecionados
    };

    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    }

    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    }

    if (isAdmin) {
        return (
            <>
                <button type="submit" onClick={toggleModal} className="m-4 w-1/12 text-white font-medium rounded-lg text-sm mb-2 mr-8 px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700">Adicionar Jogo</button>
                {modal && (
                    <>
                        <div className="fixed inset-0 bg-black opacity-50 z-40" />
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div
                                className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700"
                                ref={modalRef}
                            >
                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                                        Adicionar Jogo
                                    </h1>
                                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                        <div>
                                            <label htmlFor="text" className="block mb-2 text-sm font-medium text-white">Nome</label>
                                            <input type="text" name="nome" id="nome" value={name} onChange={(e) => setName(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required />
                                        </div>
                                        <div>
                                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-white">Descrição</label>
                                            <input type="text" name="descricao" id="descricao" value={description} onChange={(e) => setDescription(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required />
                                        </div>
                                        <div>
                                            <label htmlFor="genero" className="block mb-2 text-sm font-medium text-white">Gênero</label>
                                            <select id="generos" value={category} onChange={(e) => setCategory(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required>
                                                <option value=''>Escolha um</option>
                                                {categoryList.map((s, k) => (
                                                    <option key={k} value={s.name}>
                                                        {s.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="valor" className="block mb-2 text-sm font-medium text-white">Preço</label>
                                            <input type="number" name="valor" id="valor" step="any" value={price} onChange={(e) => setPrice(e.target.value)} className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required />
                                        </div>
                                        <div>
                                            <label htmlFor="imagem" className="block mb-2 text-sm font-medium text-white">Imagem</label>
                                            <input type="file" name="imagem" id="imagem" accept="image/*" onChange={handleImageChange} multiple className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required />
                                        </div>
                                        <button type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">Cadastrar Jogo</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </>
        )
    }
}

export default AddGame; 

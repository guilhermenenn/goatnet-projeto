import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import UserGames from "../components/UserGames";


const Library = () => {
    return (
        <div>
            <div className="min-h-screen">
                <Navbar />
                <div className="px-4">
                    <div className="bg-slate-600 rounded px-3 mt-4 mb-4 text-left text-xl">
                        Meu jogos
                    </div>
                </div>
                <UserGames />
            </div>
            <Footer />
        </div>
    )
}

export default Library;
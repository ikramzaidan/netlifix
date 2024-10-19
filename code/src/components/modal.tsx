interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    overview: string;
    genres: [];
}

interface Movies {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    overview: string;
}

interface ModalProps {
    movie: Movie | undefined;
    favMovies: Movies[];
    onFavorite: (id: number, status: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ favMovies, movie, onFavorite }) => {
    return(
        <>
            {movie !== undefined && (
                <div className="flex flex-col relative w-[850px] min-h-screen bg-gray-800 inset-x-0 mx-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="w-full relative">
                        <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} className="aspect-[16/9] object-cover"></img>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-70% to-gray-800"></div>
                        <div className="absolute inset-0 p-10">
                            <h2 className="text-5xl mb-3">{movie.title}</h2>
                            <div className="flex">
                                {favMovies.some((movie) => movie.id === movie.id) ? (
                                    <button className="bg-white text-black py-2 px-5" onClick={() => onFavorite(movie.id, false)}>Remove To Favorite</button>
                                ) : (
                                    <button className="bg-white text-black py-2 px-5" onClick={() => onFavorite(movie.id, true)}>Add To Favorite</button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="px-10 py-5">
                        <p>{movie.overview}</p>
                    </div>
                    
                </div>
            )}
        </>
    )
}

export default Modal;
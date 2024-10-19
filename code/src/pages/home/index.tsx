import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "../../components/loading";
import Modal from "../../components/modal";

interface Movies {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    overview: string;
}

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    overview: string;
    genres: [];
}

const Home = () => {
    const { apiKey } = useOutletContext<{ apiKey: string }>();
    const { user } = useOutletContext<{user: any}>();
    const [playingMovies, setPlayingMovies] = useState<Movies[]>([]);
    const [popularMovies, setPopularMovies] = useState<Movies[]>([]);
    const [favoriteMovies, setFavoriteMovies] = useState<Movies[]>([]);
    const [focusedMovie, setFocusedMovie] = useState<Movie | undefined>();
    const [visibleCount, setVisibleCount] = useState(6);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPlayingLoading, setIsPlayingLoading] = useState(true);
    const [isPopularLoading, setIsPopularLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchFavoriteMovies();
    }, [user])

    const fetchData = () => {
        const options = {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`
            }
        };
          
        axios.get('https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1', options)
            .then(response => {
              setPlayingMovies(response.data.results.slice(0,6));
              setIsPlayingLoading(false);
            })
            .catch(error => {
              console.error(error);
            });

        Promise.all([
            axios.get('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options),
            axios.get('https://api.themoviedb.org/3/movie/popular?language=en-US&page=2', options),
        ]).then((responses) => {
            const combinedMovies = [...responses[0].data.results, ...responses[1].data.results];
            setPopularMovies(combinedMovies.slice(0,30));
            setIsPopularLoading(false);
        })
        .catch(error => {
            console.error(error);
        });
    }

    const fetchFavoriteMovies = () => {
        const options = {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`
            }
        };

        if (user && user !== undefined) {
            axios.get(`https://api.themoviedb.org/3/account/${user.id}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`, options)
                .then(response => {
                    setFavoriteMovies(response.data.results);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

    const loadMore = () => {
        setVisibleCount(prevVisible => prevVisible + 6);
    };

    const handleFocusMovie = (id: number) => {
        const options = {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`
            }
        };

        axios.get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
            .then(response => {
              setFocusedMovie(response.data);
            })
            .catch(error => {
              console.error(error);
            });

        setIsModalVisible(true);
    };

    const handleAddFavorite = (id: number, status: boolean) => {
        const options = {
            method: 'POST',
            url: `https://api.themoviedb.org/3/account/${user.id}/favorite`,
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              Authorization: `Bearer ${apiKey}`
            },
            data: {media_type: 'movie', media_id: id, favorite: status}
          };
          
          axios.request(options)
            .then(response => {
                console.log(response.data.status);
                fetchFavoriteMovies();
            })
            .catch(function (error) {
                console.error(error);
            });
    }

    return(
        <div className="flex flex-col">
            {isModalVisible && (
                <div className="fixed w-full h-full bg-black z-10 bg-opacity-50 overflow-y-auto py-10" onClick={() => { setIsModalVisible(false); setFocusedMovie(undefined); }}>
                    <Modal movie={focusedMovie} favMovies={favoriteMovies} onFavorite={handleAddFavorite}></Modal>
                </div>
            )}


            
            <div className="flex items-center w-full relative min-h-[400px]">
                {playingMovies.length > 0 && (
                    <>
                        <img src={`https://image.tmdb.org/t/p/original${playingMovies[0].backdrop_path}`} className="w-full max-h-screen object-cover"></img>
                        <div className="flex flex-row w-full absolute px-10">
                            <div className="flex flex-col basis-1/2">
                                <h3 className="text-6xl font-bold">{playingMovies[0].title}</h3>
                                <p className="text-xl">{playingMovies[0].overview}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex flex-col relative px-10 -mt-20">
                <div className="flex flex-col mb-10">
                    <h2 className="text-2xl">Now Playing</h2>
                    {!isPlayingLoading ? (
                        <div className="grid grid-cols-6 gap-2">
                            {playingMovies.map((items) => (
                                <div className="w-full bg-black cursor-pointer" key={items.id} onClick={() => handleFocusMovie(items.id)}>
                                    <img src={`https://image.tmdb.org/t/p/original${items.backdrop_path}`} className="" alt={items.title} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Loading></Loading>
                    )}
                </div>
                <div className="flex flex-col mb-10">
                    <h2 className="text-2xl">Popular</h2>
                    {!isPopularLoading ? (
                        <div className="grid grid-cols-6 gap-2 mb-2">
                            {popularMovies.slice(0, visibleCount).map((items) => (
                                <div className="w-full bg-black cursor-pointer" key={items.id} onClick={() => handleFocusMovie(items.id)}>
                                    <img src={`https://image.tmdb.org/t/p/w400${items.poster_path}`} className="" alt={items.title} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Loading></Loading>
                    )}
                    
                    {visibleCount < popularMovies.length && (
                        <button onClick={loadMore}>Load More</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
import axios from "axios";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Loading from "../../components/loading";
import Modal from "../../components/modal";

interface FavoriteMovies {
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

const Profile = () => {
    const { apiKey } = useOutletContext<{ apiKey: string }>();
    const { user } = useOutletContext<{user: any}>();
    const [isLoading, setIsLoading] = useState(true);
    const [focusedMovie, setFocusedMovie] = useState<Movie | undefined>();
    const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovies[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        fetchFavoriteMovies();
    }, [user]);

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
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }

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

            <div className="flex flex-col px-10 mt-32">
                <div className="flex flex-col mb-10">
                    <h2 className="text-2xl">My Favorite List</h2>
                    {!isLoading ? (
                        <div className="grid grid-cols-6 gap-2">
                            {favoriteMovies.map((items) => (
                                <div className="w-full bg-white cursor-pointer" key={items.id} onClick={() => handleFocusMovie(items.id)}>
                                    <img src={`https://image.tmdb.org/t/p/original${items.backdrop_path}`} className="" alt={items.title} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Loading></Loading>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;
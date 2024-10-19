import { Link, useLocation } from "react-router-dom"

interface UserDetail {
    id: number;
    username: string;
}

interface NavbarProps {
    user: UserDetail | undefined;
    onLogOut: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogOut }) => {

    const location = useLocation();

    const isLoginPage = location.pathname === '/login';

    return(
        <div className="flex items-center justify-between w-full bg-black fixed top-0 px-10 py-5 z-10">
            <div className="flex items-center gap-10">
                <Link to="/" className="text-2xl text-red-500">Netlifix</Link>
                {user !== undefined && (
                    <Link to="/profile" className="">My List</Link>
                )}
            </div>
            <div className="flex gap-3">
                {!isLoginPage && (
                    <>
                        {user !== undefined ? (
                            <>
                                <div className="">{user.username}</div>
                                <button onClick={onLogOut}>Keluar</button>
                            </>
                        ) : (
                            <Link to={"/login"}>Masuk</Link>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Navbar;
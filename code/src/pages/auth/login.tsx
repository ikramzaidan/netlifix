import axios from "axios";
import { useOutletContext } from "react-router-dom";

const Login = () => {
    const { apiKey } = useOutletContext<{ apiKey: string }>();

    const handleSignIn = () => {
        const options = {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`
            }
        };

        axios.get('https://api.themoviedb.org/3/authentication/token/new', options)
            .then(response => {
                window.location.replace(`https://www.themoviedb.org/authenticate/${response.data.request_token}?redirect_to=http://localhost:5173`);
            })
            .catch(error => {
              console.error(error);
            });
    }

    return(
        <div className="flex justify-center items-center min-h-screen bg-cover bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/7c0e18aa-2c95-474d-802e-7f30e75dcca4/web/ID-en-20241014-TRIFECTA-perspective_725e6e0b-0345-457f-bbc7-eb40a7b0d1a0_large.jpg')]">
            <div className="w-full h-screen bg-gradient-to-b from-transparent from-0% to-black/[0.8]"></div>
            <div className="flex flex-col absolute w-[28rem] bg-black/[0.8] px-12 py-10">
                <h4 className="text-4xl mb-5">Sign In</h4>
                <button onClick={handleSignIn} className="bg-red-500 text-xl py-3 mb-3">Sign In with TMDB</button>
                <div className="text-center mb-3">Or</div>
                <button className="bg-gray-600 text-xl py-3 mb-5">Continue as A Guest</button>
            </div>
        </div>
    )
}

export default Login;
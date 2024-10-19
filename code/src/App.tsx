import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./components/navbar";

interface UserDetail {
  id: number;
  username: string;
}

function App() {

  const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjI4ZGMyYzhiZjUzYjg2M2Y4MmU1MDQxZGIzZGQxYyIsIm5iZiI6MTcyOTA4NDE4NC4yMzg2OTQsInN1YiI6IjY1NDZjYjc5ZDU1YzNkMDBmZjk1OGFkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oQIIxomEmXHFD6p0QCxGUSn3vvl3fDsbV5J2_Ud2DWE";

  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | undefined>();
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('session_id'));

  const fetchUser = async (request_token: string) => {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
    };


    const sessionID = await axios.post<{ session_id: string }>("https://api.themoviedb.org/3/authentication/session/new", { request_token }, options)
      .then(response => response.data.session_id)
      .catch(error => {
        console.error(error);
      });

    if (sessionID) {
      await axios.get(`https://api.themoviedb.org/3/account/account_id?session_id=${sessionID}`, options)
        .then(response => {
          localStorage.setItem('session_id', sessionID);
          setUser(response.data);
          console.log(user);
          navigate('/');
        })
    }
  };

  useEffect(() => {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
    };

    if (sessionId) {
      axios.get(`https://api.themoviedb.org/3/account/account_id?session_id=${sessionId}`, options)
        .then(response => {
          setUser(response.data);
        });
    } else {
      setUser(undefined);
    }
  }, [sessionId]);

  useEffect(() => {
    if (location.search !== '') {
      let request_token = location.search.substring(location.search.indexOf('=') + 1, location.search.lastIndexOf('&'));
      fetchUser(request_token);
    }
  }, [location.search])

  const handleLogOut = () => {
    const options = {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      data: {
        session_id: localStorage.getItem('session_id'),
      },
    };
  
    axios.delete('https://api.themoviedb.org/3/authentication/session', options)
      .then(response => {
        console.log(response.data)
        localStorage.removeItem('session_id');
        setSessionId(null);
        setUser(undefined);
        navigate('/login');
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white">
      <Navbar user={user} onLogOut={handleLogOut}></Navbar>
      <Outlet context={{ apiKey, user }}></Outlet>
    </div>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import Home from './pages/home/index.tsx';
import Profile from './pages/profile/index.tsx';
import Login from './pages/auth/login.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {index: true, element: <Home />},
      {path: "/profile", element: <Profile />},
      {path: "/login", element: <Login />},
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

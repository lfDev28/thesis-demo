import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/auth/login')
        }


    }, []);


    const login = (token: string) => {
        localStorage.setItem('access_token', token);
        setIsAuthenticated(true);
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
        navigate('/auth/login')
    }

    return {isAuthenticated, login, logout};
}

export default useAuth;

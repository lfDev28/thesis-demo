import {Outlet, useNavigate} from 'react-router-dom';
import useAuth from '../../utils/useAuth';
import { useEffect } from 'react';
import RootLayout from '../RootLayout';

const PrivateRoute = ({children}: any) => {
    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();


    useEffect(() => {
    if (!isAuthenticated) {
        navigate('/auth/login');
    }
    }, [isAuthenticated, navigate]);

     return (
    <RootLayout >
      <Outlet />
      </RootLayout>
    )
}

export default PrivateRoute;
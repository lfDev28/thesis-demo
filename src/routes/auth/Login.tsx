

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query'
import axios from 'axios';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import {useForm, Controller, FieldValues} from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/main/LoadingSpinner';
import useAuth from '../../utils/useAuth';

type TLogin = {
    username: string;
    password: string;
}


const Login = () => {
    const { handleSubmit, control } = useForm<TLogin>();
    const navigate = useNavigate();
    const {login} = useAuth();


    const loginMutation = useMutation({
        mutationFn: async(data: TLogin) =>{
            const response = await axios.post('/backend/auth/login', data);

            return response.data;
        
        },
        onError: (error: any) => {
            console.log(error);
        },
        onSuccess: (data) => {
            login(data);
            navigate('/');
            console.log('success');
        }
    })

    const onSubmit = (data: TLogin) => {
        loginMutation.mutate(data);

    }

    return (
        <Card>
            <CardHeader title={loginMutation?.isLoading ? <LoadingSpinner /> : "Login"} subheader={loginMutation.isError ? <div>{loginMutation.error.message}</div> : <></>} />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="username"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} label="Username" variant="outlined" fullWidth />}
                    />
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <TextField {...field} label="Password" variant="outlined" fullWidth type="password" />}
                    />
                    <CardActions>
                        <Button type="submit" variant="contained">Login</Button>
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    )


}

export default Login;

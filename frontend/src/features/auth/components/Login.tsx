import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { login } from '../services/auth';
import axiosClient from '../../../services/axiosClient';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import FeedbackAlert from '../../alerts/Alert';


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login(axiosClient, { email, password }) as { access_token: string };
            const token = response.access_token;
            localStorage.setItem('token', token);
            setSuccess(true)
            setTimeout(() => {
                void navigate('/')
            }, 1000)
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message ?? 'Giriş başarısız');
        }
    };
    const handleRegister = () => {
        void navigate('/register');
    }
    return (
        <Box maxWidth={400} mx="auto" mt={5}>
            <Typography variant="h4" mb={2}>Giriş Yap</Typography>
            {error && <FeedbackAlert severity="error" text={error} />}
            {success ? <FeedbackAlert severity='success' text='Giriş Başarılı' /> : <></>}
            <form onSubmit={e => { void handleSubmit(e); }}>
                <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    type="password"
                    label="Parola"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Giriş Yap
                </Button>
                <Button type='button' variant='text' fullWidth sx={{ mt: 2 }} onClick={handleRegister}>
                    Hesabınız yok mu? Kayıt olun.
                </Button>
            </form>
        </Box>
    );
};

export default Login;

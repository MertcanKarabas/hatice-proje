import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { register } from '../services/auth';
import axiosClient from '../../../services/axiosClient';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import FeedbackAlert from '../../alerts/Alert';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await register(axiosClient, { name, email, password });
            setSuccess('Kayıt başarılı! Giriş yapabilirsiniz.');
            setName('');
            setEmail('');
            setPassword('');
            setTimeout(() => {
                void navigate('/login');
            }, 1000)
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string }>;
            setError(axiosError.response?.data?.message ?? 'Kayıt başarısız');
        }
    };
    const handleLogin = () => {
        void navigate('/login');
    }
    return (
        <Box maxWidth={400} mx="auto" mt={5}>
            <Typography variant="h4" mb={2}>Kayıt Ol</Typography>
            {error && <FeedbackAlert severity="error" text={error} />}
            {success ? <FeedbackAlert severity='success' text='Kayıt Başarılı' /> : <></>}
            <form onSubmit={(e) => { void handleSubmit(e); }}>
                <TextField
                    fullWidth
                    label="İsim"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    margin="normal"
                    required
                />
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
                    Kayıt Ol
                </Button>
                <Button variant="text" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
                    Zaten hesabınız var mı? Giriş yapın.
                </Button>
            </form>
        </Box>
    );
};

export default Register;

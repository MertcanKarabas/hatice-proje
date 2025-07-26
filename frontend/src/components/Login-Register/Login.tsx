import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { login } from '../../services/auth';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await login({ email, password });
            const token = response.data.access_token;
            localStorage.setItem('token', token); // Token'ı sakla
            alert('Giriş başarılı!');
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Giriş başarısız');
        }
    };
    const handleRegister = () => {
        return navigate('/register');
    }
    return (
        <Box maxWidth={400} mx="auto" mt={5}>
            <Typography variant="h4" mb={2}>Giriş Yap</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit}>
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

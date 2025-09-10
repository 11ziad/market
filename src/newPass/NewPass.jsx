import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Box, Button, TextField, Typography, Alert, CircularProgress, Paper, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';

export default function NewPass() {
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetPassword = async () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrorMsg('البريد الإلكتروني غير صحيح');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      setSuccessMsg('📩 تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إرسال الرابط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      sx={{
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 500,
        px: 2,
        bgcolor: 'transparent'
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 3,
          backdropFilter: 'blur(12px)',
          background: theme.palette.mode === 'dark' ? 'rgba(40,40,40,0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: '0px 8px 30px rgba(0,0,0,0.2)',
          transition: '0.3s',
          '&:hover': { boxShadow: '0px 12px 40px rgba(0,0,0,0.3)' }
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          mb={3}
          sx={{ color: theme.palette.primary.main }}
        >
          🔒 نسيت كلمة المرور؟
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        <TextField
          label="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiInputBase-root': {
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? '#2a2a2a' : '#fff'
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc'
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            }
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleResetPassword}
          fullWidth
          sx={{
            mt: 3,
            py: 1.2,
            borderRadius: 3,
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0px 6px 15px rgba(0,0,0,0.2)'
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'إرسال رابط إعادة التعيين'}
        </Button>

        <Box mt={2} textAlign="center">
          <NavLink to="/signin" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 500 }}>
            الرجوع لتسجيل الدخول
          </NavLink>
        </Box>
      </Paper>
    </Box>
  );
}

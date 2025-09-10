import React, { useState, useEffect } from 'react';
import { supabase } from '../../src/supabaseClient';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/signin');
    };
    checkSession();
  }, [navigate]);

  const handlePasswordReset = async () => {
    if (newPassword.length < 6) {
      setErrorMsg('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setSuccessMsg('✅ تم تحديث كلمة المرور بنجاح، سيتم تحويلك إلى صفحة تسجيل الدخول...');
      setTimeout(() => navigate('/signin'), 2000);
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء تحديث كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        bgcolor: theme.palette.background.default,
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          backdropFilter: 'blur(12px)',
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.palette.mode === 'dark'
            ? '0px 8px 30px rgba(0,0,0,0.6)'
            : '0px 8px 30px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: theme.palette.mode === 'dark'
              ? '0px 12px 40px rgba(0,0,0,0.8)'
              : '0px 12px 40px rgba(0,0,0,0.3)'
          },
          transition: '0.3s'
        }}
      >
        <Typography
          variant="h5"
          align="center"
          fontWeight="bold"
          mb={3}
          sx={{ color: theme.palette.primary.main }}
        >
          🔐 إعادة تعيين كلمة المرور
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        <TextField
          label="كلمة المرور الجديدة"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{
            '& .MuiInputBase-root': {
              borderRadius: 3,
              bgcolor: theme.palette.mode === 'dark' ? '#1c1c1c' : '#fff',
              color: theme.palette.text.primary
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.mode === 'dark' ? '#555' : '#ccc'
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.primary.main
            },
            '& .MuiInputLabel-root': {
              color: theme.palette.text.secondary
            }
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handlePasswordReset}
          fullWidth
          sx={{
            mt: 3,
            py: 1.2,
            borderRadius: 3,
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: theme.palette.mode === 'dark'
              ? '0px 6px 15px rgba(0,0,0,0.6)'
              : '0px 6px 15px rgba(0,0,0,0.2)'
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'تحديث كلمة المرور'}
        </Button>
      </Paper>
    </Box>
  );
}
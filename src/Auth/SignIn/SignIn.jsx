import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { NavLink, useNavigate } from 'react-router-dom'

// MUI
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
  Link,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTranslation } from 'react-i18next'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()
  const theme = useTheme()
   const { i18n } = useTranslation()
   const { t } = useTranslation()
const isArabic = i18n.language === 'ar'

  useEffect(() => {
    // اخفاء رسائل الخطأ بعد 4 ثواني (اختياري)
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(''), 4000)
      return () => clearTimeout(t)
    }
  }, [errorMsg])

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 3000)
      return () => clearTimeout(t)
    }
  }, [successMsg])

  const validateForm = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return t('Invalidemail')
    if (!password) return t('Passwordrequired')
    return null
  }

  const handleSignIn = async () => {
    const validationError = validateForm()
    if (validationError) {
      setErrorMsg(validationError)
      return
    }

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('تعذر الحصول على بيانات المستخدم')

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, phone')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      localStorage.setItem('profile', JSON.stringify(profileData))

      setSuccessMsg(t('Youhavebeenloggedinsuccessfully'))
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      setErrorMsg(err.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="section"
      sx={{
        position: 'fixed',       // يغطي الشاشة بالكامل ويمنع scroll مرئي
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',      // يمنع أي scroll داخل هذه الحاوية
                 background: theme.palette.mode === 'dark'
            ? 'rgba(40, 40, 40, 0.85)'
            : 'rgba(255, 255, 255, 0.85)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          position: 'relative',                      // لإظهار التنبيهات عائمة
          width: 'min(420px, 92vw)',                 // responsive width
          maxHeight: 'calc(100vh - 40px)',           // يمنع تجاوز ارتفاع الشاشة
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          px: { xs: 2, sm: 4 },                      // أقل padding على الموبايل
          py: { xs: 2, sm: 4 },
          borderRadius: 3,
          backdropFilter: 'blur(8px)',
          background: theme.palette.mode === 'dark' ? '#1e1e1e' : 'rgba(255,255,255,0.88)',
          boxShadow: '0 10px 30px rgba(2,6,23,0.2)'
        }}
      >
        {/* تنبيهات عائمة (لا تزيد الارتفاع) */}
  {errorMsg && (
  <Alert
    severity="error"
    sx={{
      position: 'absolute',
      top: -12,
      left: 12,
      right: 13,
      zIndex: 20,
      borderRadius: 2,
      display: 'flex',
flexDirection: isArabic ? 'row-reverse' : 'row',
      alignItems: 'center'
    }}
    action={
      <IconButton size="small" onClick={() => setErrorMsg('')}>
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    {errorMsg}
  </Alert>
)}

{successMsg && (
  <Alert
    severity="success"
    sx={{
      position: 'absolute',
      top: -12,
      left: 12,
      right: 13,
      zIndex: 20,
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'row-reverse',
      alignItems: 'center'
    }}
    action={
      <IconButton size="small" onClick={() => setSuccessMsg('')}>
        <CloseIcon fontSize="small" />
      </IconButton>
    }
  >
    {successMsg}
  </Alert>
)}

        {/* محتوى الفورم – نضيف margin-top لو في alert ظاهر علشان ما يخبيش العنوان */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: (errorMsg || successMsg) ? 4 : 0 }}>
          <Typography
            variant="h5"
            align="center"
            fontWeight={700}
            sx={{ color: theme.palette.primary.main }}
          >
            {t('Login')}
              </Typography>

          <TextField
            label={t('email')}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            variant="outlined"
            inputProps={{ autoComplete: 'email' }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#111316' : '#fff'
              }
            }}
          />

          <TextField
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="small"
            margin="dense"
            variant="outlined"
            inputProps={{ autoComplete: 'current-password' }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? '#111316' : '#fff'
              }
            }}
          />
             
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSignIn}
                            fullWidth
                            disabled={loading}
                            sx={{
                              mt: 1,
                              py: 1.1,
                              borderRadius: 2,
                              fontWeight: 700,
                              textTransform: 'none'
                            }}
                          >
                            {loading ? <CircularProgress size={20} thickness={5} sx={{ color: '#fff' }} /> : t('Login')}
                          </Button>
          {/* روابط أنيقة - بجانب بعض لكن تتكسر عمودياً على الشاشات الصغيرة */}
          <Box sx={{ display: 'flex', justifyContent: 'center',flexDirection:'column',alignItems:'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <NavLink style={{ color: '#42a5f7ff' }}

              component="button"
              onClick={() => navigate('/newauth')}
              sx={{
                fontSize: '0.95rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
             {t('Donthaveanaccount')}
            </NavLink>

            <NavLink style={{ color: '#42a5f7ff' }}

              component="button"
              onClick={() => navigate('/newpassword')}
              sx={{
                fontSize: '0.9rem',
                textTransform: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              {t('Forgotyourpassword')}
            </NavLink>
          </Box>
   
        </Box>
      </Paper>
    </Box>
  )
}

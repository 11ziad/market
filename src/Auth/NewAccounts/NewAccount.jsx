import React, { useState } from 'react'
import { supabase } from '../../supabaseClient'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  CircularProgress,
  Alert,
  useTheme,
  Paper
} from '@mui/material'

export default function NewAccount() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const navigate = useNavigate()
  const theme = useTheme()

  const validateForm = () => {
    if (!fullName.trim()) return 'الاسم الكامل مطلوب'
    if (!phone.match(/^[0-9]{10,15}$/)) return 'رقم الهاتف غير صحيح'
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'البريد الإلكتروني غير صحيح'
    if (password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
    return null
  }

  const handleSignUp = async () => {
    const validationError = validateForm()
    if (validationError) {
      setErrorMsg(validationError)
      return
    }

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone: phone } }
      })
      if (signUpError) throw signUpError

      let user = signUpData.user
      if (!user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        const afterLogin = await supabase.auth.getUser()
        user = afterLogin.data.user
      }
      if (!user) throw new Error('تعذر الحصول على المستخدم بعد تسجيل الدخول')

      let avatarUrl = ''
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${user.id}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true })
        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
        avatarUrl = publicUrlData.publicUrl
      }

      const { error: upsertError } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: fullName,
        phone: phone,
        avatar_url: avatarUrl,
        address: ''
      })
      if (upsertError) throw upsertError

      setSuccessMsg('🎉 تم إنشاء الحساب بنجاح!')
      setTimeout(() => navigate('/profile'), 800)
    } catch (err) {
      console.error('Signup Error:', err)
      setErrorMsg(err.message || 'حصل خطأ أثناء إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    setAvatarFile(file)
    if (file) setAvatarPreview(URL.createObjectURL(file))
  }

  return (
<Box
  sx={{
    minHeight: '100vh', // ✅ يخلي الصفحة تبدأ بملء الشاشة وتطول عادي
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // ✅ علشان يبدأ من فوق ويسمح بالتمدد
    py: 5, // ✅ padding علشان يبعد المحتوى عن الحافة
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, #1e1e1e 0%, #1e1e1e 100%)'
      : 'linear-gradient(135deg, #eaf4ff 0%, #ffffff 100%)',
  }}
>
  <Paper
    elevation={6}
    sx={{
      width: 'min(550px, 92vw)',
      p: { xs: 3, sm: 4 },
      borderRadius: 3,
      backdropFilter: 'blur(10px)',
      background: theme.palette.mode === 'dark'
        ? '1e1e1e'
        : 'rgba(255, 255, 255, 0.9)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    }}
  >
        <Typography
          variant="h5"
          mb={3}
          align="center"
          fontWeight={700}
          sx={{ color: theme.palette.primary.main }}
        >
            إنشاء حساب جديد
        </Typography>

        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            src={avatarPreview || ''}
            sx={{
              width: 80,
              height: 80,
              bgcolor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0'
            }}
          />
        </Box>

        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mb: 2, borderRadius: 2, textTransform: 'none' }}
        >
          اختر صورة شخصية
          <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
        </Button>

        <TextField
          label="الاسم الكامل"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
        />

        <TextField
          label="رقم الهاتف"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
        />

        <TextField
          label="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
        />

        <TextField
          label="كلمة المرور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
          sx={{ '& .MuiInputBase-root': { borderRadius: 2 } }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSignUp}
          fullWidth
          sx={{ mt: 2, py: 1.2, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'تسجيل جديد'}
        </Button>

        <NavLink
          to="/signin"
          style={{
            display: 'block',
            marginTop: '15px',
            textAlign: 'center',
            color: theme.palette.mode === 'dark' ? '#93c5fd' : '#1d4ed8',
            fontWeight: 500,
            textDecoration: 'none'
          }}
        >
          لديك حساب بالفعل؟ تسجيل دخول
        </NavLink>
      </Paper>
    </Box>
  )
}

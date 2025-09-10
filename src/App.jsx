import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout/Layout';
import NewAccount from './Auth/NewAccounts/NewAccount';
import SignIn from './Auth/SignIn/SignIn';
import NewPass from './newPass/NewPass';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import ResetPassword from './Auth/Reset-password';
import Addproduct from './AddProduct/AddProduct';
import ProfileDetails from './ProfileDetails/ProfileDetails';
import Message from './Message/Message';
import Cart from './Cart/Cart';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { useTranslation } from 'react-i18next'; // ⬅️ مهم علشان نعرف اللغة

const routers = createBrowserRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'newauth', element: <NewAccount /> },
      { path: 'signin', element: <SignIn /> },
      { path: 'newpassword', element: <NewPass /> },
      { path: 'resetpass', element: <ResetPassword /> },
      { path: 'profile', element: <Profile /> },
      { path: 'addProduct', element: <Addproduct /> },
      { path: 'profiledetails/:id', element: <ProfileDetails /> },
      { path: 'message/:otherUserId?', element: <Message /> },
      { path: 'cart', element: <Cart /> },
    ],
  },
]);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { i18n } = useTranslation(); // ⬅️ نجيب اللغة الحالية
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const fontFamily = isArabic
    ? 'IBM Plex Sans Arabic, sans-serif'
    : 'Inter, sans-serif';

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      background: {
        default: isDarkMode ? '#121212' : '#ffffff'
      }
    },
    direction: isArabic ? 'rtl' : 'ltr',
    typography: {
      fontFamily
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-center" />
      <RouterProvider
        router={createBrowserRouter([
          {
            path: '',
            element: (
              <Layout
                toggleTheme={toggleTheme}
                isDarkMode={isDarkMode}
              />
            ),
            children: routers.routes[0].children,
          },
        ])}
      />
    </ThemeProvider>
  );
}

export default App;
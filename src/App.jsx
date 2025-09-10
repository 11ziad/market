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

const lightTheme = createTheme({
  palette: {
    mode: 'light',
     background: {
      default: '#ffffffff',
      }

  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // حفظ التفضيل في localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('preferredTheme');
    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
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
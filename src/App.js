import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import MainFeedLayout from './pages/MainFeedLayout';
import FollowFeedLayout from './pages/FollowFeedLayout';
import AdminUserList from './pages/AdminUserList';
import { Account } from './pages/Account'
import { SinglePost } from './pages/SinglePost';
import { CreatePost } from './pages/CreatePost';
import { Password } from './pages/Password';
import { Profile } from './pages/Profile';
import { UserProvider } from './helpers/UserContext';
import ProtectedRoute from './helpers/ProtectedRoute';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './Login.css';
import './Register.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  const client = new QueryClient();
  
  return (
    <UserProvider>
      <div className='App'>
        <Router>
          <QueryClientProvider client={client}>
          <Routes>
            <Route path='/createpost' element={<CreatePost />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/account' element={<Account />} />
            <Route path='/password' element={<Password />} />
            <Route path='/profile/:username' element={<Profile />} />
            <Route path='/post/:id' element={<SinglePost />} />
            <Route path='/' element={<ProtectedRoute element={MainFeedLayout} />} />
            <Route path='/following' element={<ProtectedRoute element={FollowFeedLayout} />} />
            <Route path='/admin/users' element={<ProtectedRoute element={AdminUserList}/>} />
          </Routes>
          </QueryClientProvider>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;
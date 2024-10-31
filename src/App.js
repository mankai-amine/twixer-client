import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { Account } from './pages/Account'
import { SinglePost } from './pages/SinglePost';
import { CreatePost } from './pages/CreatePost';
import { Password } from './pages/Password';
import { Profile } from './pages/Profile';
import { UserProvider } from './helpers/UserContext';
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
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/account' element={<Account />} />
            <Route path='/password' element={<Password />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/post/:id' element={<SinglePost />} />
          </Routes>
          </QueryClientProvider>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;
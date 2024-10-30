import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import MainFeedLayout from './pages/MainFeedLayout';
import { Account } from './pages/Account'
import { UserProvider } from './helpers/UserContext';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './Login.css';
import './Register.css';
import ProtectedRoute from './helpers/ProtectedRoute';


function App() {
  return (
    <UserProvider>
      <div className='App'>
        <Router>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/account' element={<Account />} />
            <Route path='/' element={<ProtectedRoute element={MainFeedLayout} />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;
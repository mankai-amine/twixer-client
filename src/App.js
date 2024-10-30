import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { Account } from './pages/Account';
import { Password } from './pages/Password';
import { Profile } from './pages/Profile';
import { UserProvider } from './helpers/UserContext';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './Login.css';
import './Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <UserProvider>
      <div className='App'>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/account' element={<Account />} />
            <Route path='/password' element={<Password />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
};

export default App;
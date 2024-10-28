import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './Login.css';
import './Register.css';

const App: React.FC = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Router>
    </div>
    
  );
};

export default App;

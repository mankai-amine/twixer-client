import React from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './styles.css';

const App: React.FC = () => {
  return (
    <Router>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />

    </Router>
  );
};

export default App;

import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import './styles.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Login />
    {/* <Register /> */}  {/* Uncomment this line to see the Register component */}
</div>
  );
};

export default App;

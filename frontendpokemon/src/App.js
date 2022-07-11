import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.css';
import './pokecards.css';
import "./pokecards_tablero.css";

import Principal from './components/Principal/Principal';
import Tablero from './components/Tablero/Tablero';

function App() {

  document.body.classList.add('text-center');

  return (
    
    <div className='container'>
      <Router>
        <Routes>
          <Route path='/' element={<Principal />} />
          <Route path='/tablero_de_juego' element={<Tablero />} />
        </Routes>
      </Router>
    </div>
   
  );
}
export default App;

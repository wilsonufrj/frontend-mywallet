import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css"

import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './pages/Home/Login/Login';
import Carteira from './pages/Home/Carteira/Carteira';
import Mes from './pages/Home/Mes/Mes';
import Resumo from './pages/Home/Mes/Resumo';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/carteira' element={<Carteira />} />
          <Route path='/mes/:id' element={<Mes />} />
          <Route path='/resumo/:id' element={<Resumo />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

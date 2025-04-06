import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css"

import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './pages/Home/Login/Login';
import Carteiras from './pages/Home/Carteira/Carteiras';
import CarteiraDetail from './pages/Home/Carteira/CarteiraDetail';
import Mes from './pages/Home/Mes/Mes';


function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/carteiras' element={<Carteiras />} />
          <Route path='/carteira/:id' element={<CarteiraDetail />} />
          <Route path='/mes/:id' element={<Mes />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import YahtzeeGame from './pages/game';
import { Home } from './pages/home';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pending-games/:gameId" element={<YahtzeeGame />} />
    </Routes>
  );
};

export default App;

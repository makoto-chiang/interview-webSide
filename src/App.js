
import { HashRouter, Route, Routes } from 'react-router-dom';
import Household from './pages/household/Household';


const App = () => {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path='/' element={<Household />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

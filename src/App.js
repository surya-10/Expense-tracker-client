import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Forgot from './pages/Forgot';
import Update from './pages/Update';
import Home from './components/Home';
import Visualize from './components/Visualize';
import Add from './components/Add';
import Edit from './components/Edit';
import Expenses from './components/Expenses';
import { Provider } from 'react-redux';
import { myStore } from './redux/configure';

function App() {
  return (
    <div className="App">
      <Provider store={myStore}>
      <Routes>
        <Route exact path='/' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/reset-password/:id/:token' element={<Update/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/view' element={<Visualize/>}/>
        <Route path='/add' element={<Add/>}/>
        <Route path='/edit/:id' element={<Edit/>}/>
        <Route path='/expenses' element={<Expenses/>}/>
      </Routes>
      </Provider>
    </div>
  );
}

export default App;

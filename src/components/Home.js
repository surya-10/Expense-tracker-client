import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';

function Home({ children }) {
  let navigate = useNavigate();
  let [show, setShow] = useState(false);
  


  function logout() {
    localStorage.clear();
    navigate("/login");
  }

 
  return (
    <div className='home-div'>
      <div className='nav-bar'>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <p className="navbar-brand mt-2 h3">EXPENSE TRACKER</p>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item me-4">
                  <NavLink className='home-btn nav-link' to="/view">Home</NavLink>
                </li>
                <li className="nav-item me-4">
                  <NavLink className='home-btn nav-link' to="/expenses">Expenses</NavLink>
                </li>
                <li className="nav-item me-4">
                  <NavLink className='home-btn nav-link' to="/add">Add Expense</NavLink>
                </li>
              </ul>
              <div className='btn-logout'>
                <button className='btns' onClick={logout}>Logout</button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className=''>
        {children}
      </div>
    </div>
  );
}

export default Home;

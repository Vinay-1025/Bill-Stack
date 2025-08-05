import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import TimeDate from './TimeDate';
import { BiAddToQueue, BiCategory, BiCategoryAlt, BiDetail, BiHome, BiHomeAlt, BiHomeAlt2, BiReceipt, BiScan, BiSolidDashboard, BiUpload } from 'react-icons/bi'


const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg header-cont px-3">
      <NavLink className="navbar-brand fw-bold fs-4 align-items-center" to="/" style={{color: '#212EA0'}}>
        <img src="./favcon3.png" width="25px" style={{marginRight: '5px', marginBottom: '9px'}}/>Bill-Stack
      </NavLink>

      <div className="header-main">
        <div className="d-lg-block">
          <TimeDate />
        </div>
        <ul className="navbar-nav nav-items">
          <li className="nav-item">
            <NavLink to="/" className="nav-link" activeclassname="active">
              <BiAddToQueue size={24} />
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/bills" className="nav-link" activeclassname="active">
              <BiReceipt size={24} />
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/category" className="nav-link" activeclassname="active">
              <BiCategoryAlt size={24} />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;

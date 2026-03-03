import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header-area header-sticky">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <Link to="/" className="logo">
                <img src="/assets/images/logo.png" alt="" />
              </Link>
              <ul className="nav">
                <li className="scroll-to-section">
                  <Link to="/">Home</Link>
                </li>
                <li className="scroll-to-section">
                  <a href="#services">Services</a>
                </li>
                <li className="scroll-to-section">
                  <a href="#about">About</a>
                </li>
                <li className="has-sub">
                  <a href="#" onClick={(e) => e.preventDefault()}>Pages</a>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/about">About Us</Link>
                    </li>
                    <li>
                      <Link to="/services">Our Services</Link>
                    </li>
                    <li>
                      <Link to="/contact">Contact Us</Link>
                    </li>
                  </ul>
                </li>
                <li className="scroll-to-section">
                  <a href="#testimonials">Testimonials</a>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
              <a className="menu-trigger">
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
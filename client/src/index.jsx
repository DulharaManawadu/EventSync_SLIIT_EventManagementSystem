import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import $ from 'jquery';

window.jQuery = window.$ = $;

import './assets/css/fontawesome.css';
import './assets/css/my.css';
import './assets/css/owl.css';
import './assets/css/animate.css';
import './assets/js/owl-carousel.js';
import './assets/js/swiper.js';
import './assets/js/custom.js';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

import '@babel/polyfill';
import { login, logout } from './auth';
import displayMap from './mapbox';

const mapBox = document.querySelector('#map');
const form = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');

const submitFormHandler = e => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    
    login(email, password);
    
    e.preventDefault();
};

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (form) {
    addEventListener('submit', submitFormHandler);
}

if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

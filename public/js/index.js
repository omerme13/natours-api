import '@babel/polyfill';
import login from './login';
import displayMap from './mapbox';

const mapBox = document.querySelector('#map');
const form = document.querySelector('.form');

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

const submitForm = e => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    
    login(email, password);
    
    e.preventDefault();
};

if (form) {
    addEventListener('submit', submitForm);
}

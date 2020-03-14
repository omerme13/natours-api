import '@babel/polyfill';
import { login, logout } from './auth';
import { updateSettings, clearFields } from './updateSettings';
import { bookTour } from './stripe';
import displayMap from './mapbox';
import showAlert from './alerts';

const mapBox = document.querySelector('#map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userSettingsForm = document.querySelector('.form-user-settings');
const bookTourBtn = document.querySelector('#book-tour');


const submitLoginForm = e => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    
    login(email, password);
    
    e.preventDefault();
};

const submitDataForm = e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);
    
    updateSettings(form, false);
};

const submitSettingsForm = async e => {
    e.preventDefault();

    const passwordCurrent = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    document.querySelector('.btn--save-password').textContent = 'Updating...';

    await updateSettings({
        password: passwordCurrent,
        newPassword: password,
        newPasswordConfirm: passwordConfirm
    },
        true
    );

    document.querySelector('.btn--save-password').textContent = 'save password';
    clearFields('password-current', 'password', 'password-confirm')
};

const bookTourHandler = e => {
    e.target.textContent = 'Booking...';
    bookTour(bookTourBtn.dataset.tourId);
};

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}
if (loginForm) {
    loginForm.addEventListener('submit', submitLoginForm);
}
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}
if (userDataForm) {
    userDataForm.addEventListener('submit', submitDataForm);
}
if (userSettingsForm) {
    userSettingsForm.addEventListener('submit', submitSettingsForm);
}
if (bookTourBtn) {
    bookTourBtn.addEventListener('click', bookTourHandler);
}

const alertMessage = document.querySelector('body').dataset.alert;

if (alertMessage) {
    showAlert('success', alertMessage, 15);
}
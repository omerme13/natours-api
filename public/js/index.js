import '@babel/polyfill';
import { login, logout } from './auth';
import { updateSettings, clearFields } from './updateSettings';
import displayMap from './mapbox';

const mapBox = document.querySelector('#map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userSettingsForm = document.querySelector('.form-user-settings');


const submitLoginForm = e => {
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    
    login(email, password);
    
    e.preventDefault();
};

const submitDataForm = e => {
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    
    updateSettings({ name, email }, false);
    
    e.preventDefault();
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
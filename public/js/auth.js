import axios from 'axios';

import showAlert from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/signin',
            data: { email, password }
        });

        if (res.status === 200) {
            showAlert('success', 'You logged in successfully');
            window.setTimeout(() => location.assign('/'), 1500)
        }

    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios('http://localhost:3000/api/v1/users/logout');

        if (res.status === 200) {
            location.reload(true);
        }
    } catch (err) {
        showAlert('error', 'Error logging out, try again later.');
    }
};




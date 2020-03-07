import axios from 'axios';

import showAlert from './alerts';

export const updateSettings = async (data, isUpdatingPassword) => {
    const url = `http://localhost:3000/api/v1/users/${
        isUpdatingPassword ? 'update-password' : 'update-me'
    }`;

    let email = undefined;

    try {
        if (isUpdatingPassword) {
            const res = await axios('http://localhost:3000/api/v1/users/me');
            email = res.data.data.data.email;
        }

        const res = await axios({
            method: 'PATCH',
            url,
            data: { email, ...data }
        });
    
        if (res.status === 200) {
            showAlert('success', 'Updated successfully');
        }
    } 
    catch (err) {
        showAlert('error', err.response.data.message);
    }
};

export const clearFields = (...IDs) => {
    for (const id of IDs) {
        document.getElementById(id).value = '';
    }
};


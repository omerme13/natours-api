import axios from 'axios';

import showAlert from './alerts';

export const updateSettings = async (dataToUpdate, isUpdatingPassword) => {
    const url = `/api/v1/users/${
        isUpdatingPassword ? 'update-password' : 'update-me'
    }`;

    let data = dataToUpdate;

    try {
        if (isUpdatingPassword) {
            const res = await axios('/api/v1/users/me');
            const email = res.data.data.data.email;
            data = { email, ...data };
        }

        const res = await axios({
            method: 'PATCH',
            url,
            data
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


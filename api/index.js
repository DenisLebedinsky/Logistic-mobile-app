import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://logistic-servic-api.herokuapp.com'
});


export const signIn = async data => {
    try {

        const res = await instance.post('/users/login', data);
        
        if (res && res.data.hasOwnProperty('token')) {
            return res.data;
        }
    } catch (err) {
        console.log(err)
    }

    return 'error';
}

export const getPackageById = async (id, token) => {
    try {
        instance.defaults.headers.common['Authorization'] = `Baerer ${token}`;

        const res = await instance.post('package/byid', { id });

        if (res) {
            return res.data;
        } else {
            localStorage.clear();
        }
    } catch (err) {
        console.log(err)
    }

    return 'error';
}


export const updatePackage = async (data, token) => {
    try {
        

        instance.defaults.headers.common['Authorization'] = `Baerer ${token}`;

        const res = await instance.post('/package/update', data);

        if (res) {
            return res.data;
        }
    } catch (err) {
        console.log(err)
    }

    return 'error';
}
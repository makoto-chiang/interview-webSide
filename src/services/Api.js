import axios from 'axios';

const api = {
    get: url => {
        return new Promise((resolve, reject) => {
            axios({
                method: 'GET',
                url: url,
            }).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    }
}

export default api;


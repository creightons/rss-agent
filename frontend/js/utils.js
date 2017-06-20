import axios from 'axios';

export function get(url) {
  return axios(url);
}

export function getStream(url) {
    return axios({ method: 'get', url, responseType: 'stream' });
}

export function fetchStream(url) {
    let partial = '';
    return fetch(url).then(res => {
        const reader = res.body.getReader();
        function pull() {
            return reader.read().then(result => {
                partial += result;
                return pull();
            });
        }

        return pull();
    }).then(() => {
        console.log('partial = ', partial);
    }).catch(err => {
        console.log(err);
    });
}

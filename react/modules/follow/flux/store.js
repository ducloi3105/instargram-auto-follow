import createStore from '../../common/create-store';

let state = {
    loginTo: 'instagram',
    publicKey: '1q65G1o9uDePDgZXhIt7xEgaL-A', // demo,
    instagramData: null,
    appProps: {}
};

export default createStore(state);


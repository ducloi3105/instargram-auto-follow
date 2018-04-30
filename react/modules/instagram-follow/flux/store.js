import createStore from '../../common/create-store';

let state = {
    infoAccount: {
        token: '',
        id: '',
        message: '',
        status: ''
    },
    infoWho: {
        id: '',
        username: '',
        message: '',
        status: ''
    }
};

export default createStore(state);


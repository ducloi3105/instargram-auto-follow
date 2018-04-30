import createStore from '../../common/create-store';

let state = {
    query_hash: '37479f2b8209594dde7facb0d904896a',
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
    },
    filter: {
        limit: 1000,
        pageSize: 48,
        random_wait: 25,
        wait_between_actions: 25,
        wait_minus_after_sort_: 10,
        wait_hours_after_hard: 1,
    },
    dataFollow: {
        listUser: [],
        total: 0
    }

};

export default createStore(state);


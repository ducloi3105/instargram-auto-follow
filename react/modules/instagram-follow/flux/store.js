import createStore from '../../common/create-store';

let state = {
    query_hash: '37479f2b8209594dde7facb0d904896a',// followers
    query_hash_following: '58712303d941c6855d4e888c5f0cd22f',// following
    query_hash_which: '',
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
        showFollowers: {
            min: 0,
            max: 7500,
            minStep: 0,
            maxStep: 7500
        },
        keywords: '',
        showFollowed: true,
        hideFollowed: false,
    },
    configure: {
        is_random: true,
        random_wait: 25,
        wait_between_actions: 25,
        wait_minus_after_sort: 10,
        countFollow: 0
    },
    dataFollow: {
        listUser: [],
        total: 0
    },
    loading_get_list_user_followers: false,
    loading_get_list_user_following: false,
    loading_follow_list_user: false,
    progress: 0

};

export default createStore(state);


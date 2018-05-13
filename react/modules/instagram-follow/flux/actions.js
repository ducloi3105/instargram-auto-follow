import Store from './store';
import {OAuth} from "oauthio-web";
import API from '../API'
import Utils from '../../common/utils'

let timeoutFollowAll, intervalProgress, timeoutGetFollowers;
const Actions = {
    logged(newLog) {
        Store.setState(state => {
            state.logged.push(newLog);
            return state;
        })
    },
    getInfoAccount() {
        let url = window.location.origin;
        API.getUserIdFromUrl(url).then(data => {
            this.logged("Login success");
            Store.setState(state => {
                try {
                    data = JSON.parse(data.data.split("window._sharedData = ")[1].split(";</script>")[0]);


                    state.infoAccount.token = data.config.csrf_token;
                    state.infoAccount.id = data.config.viewer.id;
                    state.infoAccount.username = data.config.viewer.username;
                } catch (e) {
                    this.logged("Get info account (token, id)  failed")
                }

                return state;
            })
        }).catch(ex => {
            this.logged("404 not found")
        })
    },
    pressUserId(userId) {
        Store.setState(state => {
            state.dataFollow.listUser = [];
            state.dataFollow.total = 0;
            state.loading_get_list_user_followers = true;
            return state;
        });
        this.getSomeone(userId)
    },
    getSomeone(username) {
        if (!username) return console.warn('Typing username or redirect link to user.');
        let url = window.location.origin;
        url += '/' + username;
        API.getUserIdFromUrl(url).then(data => {
            this.logged(`Get info ${username} success`);
            Store.setState(state => {
                try {
                    data = JSON.parse(data.data.split("window._sharedData = ")[1].split(";</script>")[0]);
                    let ProfilePage = data.entry_data.ProfilePage;
                    if (ProfilePage.length > 0) {
                        let info = ProfilePage[0].graphql.user;
                        state.infoWho.username = info.username;
                        state.infoWho.id = info.id;
                    }
                } catch (e) {
                    this.logged(`Get info ${username} failed`)
                }

                return state;
            });
            this.logged(`Start get list follow from ${username}`);
            this.getListFollow();
        }).catch(ex => {
            this.logged(`${username} incorrect`);
            Store.setState(state => {
                state.infoWho.username = '';
                state.infoWho.id = '';
                state.loading_get_list_user_followers = false;
                return state;
            })
        })
    },
    getListFollow(after) {
        let state = Store.getState();
        let pageSize = (state.filter.pageSize > state.filter.limit) ? state.filter.limit : state.filter.pageSize;
        let payload = {
            query_hash: state.query_hash_which,
            userId: state.infoWho.id,
            first: pageSize,
        };
        if (after) payload.after = after;
        API.getListFollow(payload).then(data => {
            if (data.status === 200) {
                let egde_followed = state.query_hash_which === state.query_hash ? data.data.data.user.edge_followed_by : data.data.data.user.edge_follow;
                this.logged(`Get list user success`);
                Store.setState(state => {
                    state.dataFollow.listUser = state.dataFollow.listUser.concat(egde_followed.edges);
                    state.dataFollow.total = egde_followed.count;
                    state.filter.showFollowers.max = state.dataFollow.listUser.length - 1;
                    state.filter.showFollowers.maxStep = state.dataFollow.listUser.length;
                    return state;
                });
                timeoutGetFollowers = setTimeout(() => {
                    let state = Store.getState();
                    if (egde_followed.page_info.has_next_page
                        && state.dataFollow.listUser.length <= state.filter.limit
                        && state.filter.limit > state.filter.pageSize) {
                        this.logged(`Continue get list user`);
                        this.getListFollow(egde_followed.page_info.end_cursor);
                    } else {
                        this.logged(`Stop get list user`);
                        Store.setState(state => {
                            state.loading_get_list_user_followers = false;
                            return state;
                        });
                    }
                }, 1000)
            }

        }).catch(ex => {
            clearTimeout(timeoutGetFollowers);
            this.logged(`Stop get list user`);
            Store.setState(state => {
                state.dataFollow.total = 0;
                state.loading_get_list_user_followers = false;
                return state;
            })

        })
    },
    changeFilter(which, value) {
        Store.setState(state => {
            if (which === 'keywords') {
                state.filter[which] = value;
            } else if (which === 'showFollowers') {
                state.filter[which] = Object.assign({}, state.filter[which], value)
            } else if (which === 'limit') {
                value = parseInt(value);
                if (isNaN(value) || value <= 0) value = 0;
                state.filter[which] = value
            } else if (which === 'showFollowed') {
                state.filter[which] = !state.filter[which]
            }
            return state;
        })
    },
    changeConfigure(which, value) {
        Store.setState(state => {
            if (which === 'is_random') {
                state.configure[which] = !state.configure[which]
            } else {
                value = parseInt(value);
                if (isNaN(value) || value <= 0) value = 0;
                state.configure[which] = value;
            }
            return state;
        })
    },
    randomUserId() {
        let state = Store.getState();
        let _listUser = state.dataFollow.listUser.filter((item, index) => {
            return item.node.followed_by_viewer === false && item.node.requested_by_viewer === false && item.node.is_verified === false
        }).filter((item, index) => {
            return state.filter.showFollowers.min <= index <= state.filter.showFollowers.max
        }).filter(item => {
            return item.node.id !== state.infoAccount.id;
        });
        if (_listUser.length === 0) return null;
        if (_listUser.length === 1) return _listUser[0].node.id;
        let index = Utils.randomIntFromTo(0, _listUser.length - 1);
        if (index <= _listUser.length) {
            this.logged(`Follow ${_listUser[index].node.username}`);
            return _listUser[index].node.id;
        }
        else this.randomUserId();
    },

    followAll() {
        clearTimeout(timeoutFollowAll);
        clearTimeout(intervalProgress);
        let userId = this.randomUserId();
        if (!userId) {
            this.logged(`Stop follow all user`);
            return Store.setState(state => {
                state.loading_follow_list_user = false;
                return state;
            });
        }

        Store.setState(state => {
            state.loading_follow_list_user = true;
            return state;
        });
        API.followAll(userId, Store.getState().infoAccount.token).then(data => {
            if (data.data.status === 'ok') {
                this.logged(`Follow success`);
                Store.setState(state => {
                    state.dataFollow.listUser.map((item, index) => {
                        if (item.node.id === userId) {
                            item.node.followed_by_viewer = true;
                        }
                        return item;
                    });
                    state.configure.countFollow += 1;
                    return state;
                });
                this.continueFollowAll()

            } else {
                this.logged(`Follow userid ${userId} failed`);
            }
        }).catch(ex => {
            this.logged(`Follow userid ${userId} failed`);
            clearTimeout(timeoutFollowAll);
            clearInterval(intervalProgress);
            this.continueFollowAll()
        })
    },
    continueFollowAll() {
        let configure = Store.getState().configure;
        let min = configure.wait_between_actions;
        if (configure.countFollow % 15 === 0) { // follow 15 times => delay
            min = configure.wait_minus_after_sort
        }
        let max = min + min * (configure.random_wait / 100);
        let timeOut = Utils.randomIntFromTo(min, max);

        let timer = timeOut / 100;
        this.logged(`Please wait ${timeOut * 1000} second to continue`);

        intervalProgress = setInterval(() => {
            Store.setState(state => {
                state.progress += 1;
                return state;
            })
        }, timer * 1000);

        timeoutFollowAll = setTimeout(() => {
            Store.setState(state => {
                state.progress = 0;
                return state;
            });
            this.followAll();
        }, timeOut * 1000)
    },

    unfollowAll() {

    },

    continueUnfollowAll() {

    },
    setShowFollowed(is) {
        Store.setState(state => {
            state.filter.showFollowed = is;
            return state;
        })
    },

    stopFollowAll() {
        Store.setState(state => {
            state.loading_follow_list_user = false;
            state.progress = 0;
            return state;
        });
        clearTimeout(timeoutFollowAll);
        clearTimeout(intervalProgress);
    },

    stopLoadFollowers() {
        Store.setState(state => {
            state.loading_get_list_user_followers = false;
            return state;
        });
        clearTimeout(timeoutGetFollowers);
    },
    stopLoadFollowing() {
        Store.setState(state => {
            state.loading_get_list_user_followers = false;
            return state;
        });
        clearTimeout(timeoutGetFollowers);
    },
    whichFollow(is) {
        Store.setState(state => {
            state.query_hash_which = is;
            return state;
        });
    },
    showPopup(is) {
        Store.setState(state => {
            state.showPopup = is;
            return state;
        })
    }
};

export default Actions;
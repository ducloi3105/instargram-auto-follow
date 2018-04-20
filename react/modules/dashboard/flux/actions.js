import Store from './store';
import API from '../api';

const Actions = {
    setAppProps(appProps){
        Store.setState(state => {
            Object.assign(state.appProps, appProps);
            return state;
        });
    },
};

export default Actions;
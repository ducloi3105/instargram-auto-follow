import React from "react";
import Store from '../flux/store';
import Actions from '../flux/actions';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import ButtonFollow from './buttonFollowAll';
import ButtonLoadFollowers from './buttonLoadFollowers';

let RightPanel = Store.connect(class RightPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            userId: '',
            message: '',
        };
        this.changeUserId = this.changeUserId.bind(this)
        this.handleLoadFollowers = this.handleLoadFollowers.bind(this)
    }

    changeUserId(e) {
        let value = e.target.value;
        let state = this.state;
        state.userId = value;
        if (value.startsWith('http://') || value.startsWith('https://')) state.message = 'Incorrect UserId';
        else if (value.indexOf('/') != -1) state.message = 'Incorrect UserId';
        else state.message = '';
        this.setState(state)
    }

    handleLoadFollowers() {
        if (this.props.loading_get_list_user_followers) return;
        let userId = this.state.userId;
        if (!userId) {
            this.setState({message: 'Please enter user id '});
            return this.validUserId.focus();
        } else if (this.state.message) {
            return this.validUserId.focus();
        }
        Actions.setShowFollowed(true);

        Actions.pressUserId(userId);

    }

    renderMessage() {
        return (
            <div className="row-info">
                <pre style={{color: 'red'}}>{this.state.message}</pre>
            </div>
        )
    }

    componentDidUpdate() {
        if(this.checkboxFollowed){
            this.checkboxFollowed.checked = this.props.showFollowed;
        }
    }

    render() {
        let props = this.props;
        return (
            <div className="right-panel-wrapper">
                <details className="config-wrapper" open>
                    <summary>Get follower from user id:</summary>
                    <div className="config-options">
                        <div className="row-info">User Id:</div>
                        <div className="row-info">
                            <input type="text"
                                   ref={e => {
                                       this.validUserId = e;
                                   }}
                                   value={this.state.userId}
                                   placeholder="Ex: MarkZuckerberg ..."
                                   onChange={this.changeUserId}
                                   onKeyUp={e => {
                                       if (e.keyCode === 13) {
                                           this.handleLoadFollowers()
                                       }
                                   }}
                            />
                        </div>
                        {this.renderMessage()}
                        <div className="row-info">Limit get follower
                            <input type="number" value={props.limit}
                                   onChange={(e) => {
                                       Actions.changeFilter('limit', e.target.value)
                                   }}
                            />
                        </div>

                    </div>
                </details>
                <div className="load-follow">
                    <ButtonLoadFollowers loading={props.loading_get_list_user_followers} handleLoadFollowers={this.handleLoadFollowers}/>

                    <div className="multi-actions-button" onClick={this.handleLoadFollowers}>
                        <span>
                            {props.loading_get_list_user_followers ? <i className="fa fa-spinner fa-pulse fa-fw"/> : null}
                            Load following
                        </span>
                    </div>
                </div>
                <details className="config-wrapper" open>
                    <summary>Filter list users</summary>
                    <div className="config-options">
                        <div className="row-info">Filter username or user id:</div>

                        <div className="row-info">
                            <input type="text" value={props.keywords} onChange={e => {
                                Actions.changeFilter('keywords', e.target.value)
                            }}/>
                        </div>
                        <div className="row-info">
                            Show user followed:
                            <input type="checkbox" defaultChecked={props.showFollowed}
                                   ref={(el) => {
                                       this.checkboxFollowed = el;
                                   }}
                                   onChange={(e) => {
                                       Actions.changeFilter('showFollowed', e.target.value)
                                   }}
                            />

                        </div>
                        <div className="row-info">Show user from-to:</div>
                        <div className="row-info input-range">
                            <InputRange
                                step={1}
                                maxValue={props.showFollowers.maxStep}
                                minValue={props.showFollowers.minStep}
                                value={props.showFollowers}
                                onChange={(value) => {
                                    Actions.changeFilter('showFollowers', value)
                                }}/>
                        </div>
                    </div>
                </details>
                <details className="config-wrapper" open>
                    <summary>Config times</summary>
                    <div className="config-options">

                        <div className="row-info">
                            Wait between actions:
                            <input type="number" value={props.wait_between_actions}
                                   onChange={(e) => {
                                       Actions.changeConfigure('wait_between_actions', e.target.value)
                                   }}
                            />seconds
                        </div>

                        <div className="row-info">
                            {/*<input type="checkbox" defaultChecked={props.is_random} onChange={(e) => {*/}
                            {/*Actions.changeConfigure('is_random', e.target.value)*/}
                            {/*}}/>*/}
                            Randomize wait time by up to:
                            <input type="number" value={props.random_wait}
                                   onChange={(e) => {
                                       Actions.changeConfigure('random_wait', e.target.value)
                                   }}
                            />%
                        </div>

                        <div className="row-info">
                            Wait after "soft" rate limit:
                            <input type="number" value={props.wait_minus_after_sort}
                                   onChange={(e) => {
                                       Actions.changeConfigure('wait_minus_after_sort', e.target.value)
                                   }}
                            />minutes
                        </div>

                    </div>
                </details>
                <ButtonFollow loading={this.props.loading_follow_list_user}/>
            </div>
        )
    }
}, appState => {
    let configure = appState.configure;
    return {
        loading_get_list_user_followers: appState.loading_get_list_user_followers,
        loading_follow_list_user: appState.loading_follow_list_user,
        showFollowers: appState.filter.showFollowers,
        showFollowed: appState.filter.showFollowed,
        limit: appState.filter.limit,
        keywords: appState.filter.keywords,
        is_random: configure.is_random,
        random_wait: configure.random_wait,
        wait_between_actions: configure.wait_between_actions,
        wait_minus_after_sort: configure.wait_minus_after_sort
    }
});
export default RightPanel
import React from 'react';
import ReactDom from 'react-dom';
import Store from "../flux/store";
import Action from "../flux/actions";
import LeftPanelItem from './left-panel-item';
import RightPanel from './right-panel-wrapper';

class PopupContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            display: 'unset'
        };
        this.closePopup = this.closePopup.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.display !== this.state.display) this.setState({display: nextProps.display})
    }

    closePopup() {
        this.setState({display: 'none'})
    }

    render() {
        return (
            <div className="popup-container" style={{display: this.state.display}}>
                <div id="BotInjectedContainer">
                    <div className="container-wrapper">
                        <div className="header-wrap">
                            <h1>Automation for Instagram™</h1>
                            <button className="close-popup" onClick={this.closePopup}/>
                        </div>
                        <div className="content-wrap">
                            <LeftPanelItem/>

                            <RightPanel/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PopupContainer
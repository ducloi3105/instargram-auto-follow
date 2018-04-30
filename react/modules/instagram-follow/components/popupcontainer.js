import React from 'react';
import ReactDom from 'react-dom';
import Store from "../flux/store";
import Action from "../flux/actions";

class PopupContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            display: 'unset'
        };
        this.closePopup = this.closePopup.bind(this)
    }

    componentDidMount() {
        console.log('didmount')
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.display != this.state.display) this.setState({display: nextProps.display})
    }

    componentWillUnmount() {
        console.log('willmount')
    }

    closePopup() {
        this.setState({display: 'none'})
    }

    render() {
        return (
            <div className="popup-container" style={{display:this.state.display}}>
                <button className="close-popup" onClick={this.closePopup}>Đóng</button>
            </div>
        )
    }
}

export default PopupContainer
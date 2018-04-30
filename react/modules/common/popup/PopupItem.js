import React from 'react'
import {safeInvoke} from '../../utils/function-util.js'

export default class PopupItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.close = this.close.bind(this)
    }

    close() {
        safeInvoke(this.props.onClose);
    }

    render() {
        const {component, id, type} = this.props;
        return (
            <div className="popup-item" data-type={type}>
                <div className="overlay" onClick={this.close}></div>
                <div className="popup-inner">
                    <div className="space" onClick={this.close}/>
                    {component}
                </div>
            </div>
        )
    }
}
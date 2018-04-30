import './style.styl'
import React from 'react'
import PopupItem from './PopupItem.js'
import {CSSTransition, TransitionGroup} from "react-transition-group";

export default class PopupContainer extends React.Component {
    constructor(props, context) {
        super(props, context)

        const {popupService} = this.props;

        this.onUnmount(popupService.subscribe((popups) => {
            this.forceUpdate();
        }))
    }
    componentDidMount(){
        console.log('css')
    }
    render() {
        let popupItems;
        const {popupService} = this.props;
        let popupData = popupService.getData();

        if (popupData && popupData.length) {
            popupItems = popupData.map(item =>
                    <CSSTransition timeout={300} classNames="popup" key={item.id}>
                        <PopupItem {...item} onClose={() => {  popupService.remove(item.id)}}/>
                    </CSSTransition>
            )
        }

        return (
            <TransitionGroup>
                {popupItems}
            </TransitionGroup>
        )
    }
}
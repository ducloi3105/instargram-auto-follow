import './style.styl'
import React from 'react'
import {RComponent} from './../r-component.js'
import PopupItem from './PopupItem.js'
import {CSSTransition, TransitionGroup} from "react-transition-group";

export default class PopupContainer extends RComponent {
    constructor(props, context) {
        super(props, context)

        const {popupService} = this.props;

        this.onUnmount(popupService.subscribe((popups) => {
            this.forceUpdate();
        }))
    }

    render() {
        var popupItems;
        const {popupService} = this.props;
        var popupData = popupService.getData();

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
import React from 'react'
import './loading-panel.css'
import {RComponent} from "../r-component";

export class LoadingPanel extends RComponent {
    render() {
        return (
            <div className="loading-panel">
                <i className="fa fa-spinner fa-pulse"/>
            </div>
        )
    }
}
import Store from "../flux/store";
import Action from "../flux/actions"
import React from "react";
import {Fragment} from 'react';
import ItemFollow from './item-follow'
let ListFollow = Store.connect(class App extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="header-container">

                </div>
                <div className="suggest-for-you">
                    <h2>Suggest for you</h2>
                </div>
                <div className="list-container">
                    {
                        [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8].map(()=>{
                            return <ItemFollow></ItemFollow>
                    })
                    }
                </div>
            </Fragment>
        )
    }
}, appState => {
    return {}
});

export default ListFollow;
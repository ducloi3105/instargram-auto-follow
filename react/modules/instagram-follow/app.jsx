import React from 'react';
import ReactDom from 'react-dom';
import Store from "./flux/store";
import Action from "./flux/actions";
import './css/index.css';
import PopupContainer from './components/popupcontainer'

const App = Store.connect(class App extends React.Component {
    constructor() {
        super();
        this.showPopup = this.showPopup.bind(this)
        this.handleGetSomeoneId = this.handleGetSomeoneId.bind(this)
    }

    componentDidMount() {
        Action.getInfoAccount();
    }

    handleGetSomeoneId(userUrl) {
        let pathname = window.location.pathname.split('/');
        if (pathname.length > 1) {
            pathname = pathname[1];
        }

        pathname = userUrl || pathname;
        // Action.getSomeone(pathname);

    }

    showPopup() {
        this.handleGetSomeoneId();
        if (!document.getElementById('show-follow-instagram-popup')) {
            let iDiv = document.createElement('div');

            iDiv.id = 'show-follow-instagram-popup';
            document.getElementsByTagName('body')[0].appendChild(iDiv);
        }

        ReactDom.render(<PopupContainer display="unset"/>, document.getElementById('show-follow-instagram-popup'));
    }

    render() {

        return (
            <div className="follow-container" onClick={this.showPopup} title="Automation for Instagram™" 
                 style={{backgroundImage:`url(${chrome.extension.getURL('display_image.png')})`}}
            />
        )
    }
}, appState => {
    return {
        loginTo: appState.loginTo,
        publicKey: appState.publicKey
    }
});

if (!document.getElementById('follow-instagram-310594')) {
    let iDiv = document.createElement('div');
    iDiv.id = 'follow-instagram-310594';
    document.getElementsByTagName('body')[0].appendChild(iDiv);

    //add css
    let head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
    link.media = 'all';
    head.appendChild(link);
}
ReactDom.render(<App/>, document.getElementById('follow-instagram-310594'));

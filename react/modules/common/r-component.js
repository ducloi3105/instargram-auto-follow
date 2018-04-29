import React,{Component} from "react";

export class RComponent extends Component {
    onUnmounts = [];
    onMounts = [];
    mounted = false;

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        this.mounted = true;
        this.onMounts.forEach((onMount)=> onMount());
    }

    componentWillUnmount() {
        this.mounted = false;
        this.onUnmounts.forEach((onUnmount)=> onUnmount());
    }

    setState(newState, callback) {
        if (this.mounted) {
            super.setState(newState, callback);
        }
    }

    safeUpdate() {
        if (this.mounted) {
            this.forceUpdate();
        }
    }

    onMount(f) {
        this.onMounts.push(f);
    }

    onUnmount(f) {
        this.onUnmounts.push(f);
    }

}
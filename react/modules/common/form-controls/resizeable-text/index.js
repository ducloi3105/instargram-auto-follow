import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ResizeableText extends Component {
    constructor(props){
        super(props)
        this.state = {
            value: this.props.value
        }
        this.resize = this.resize.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onClick = this.onClick.bind(this)
        this.refFn = this.refFn.bind(this)
    }
    componentDidMount() {
        if(this.props.value){
            setTimeout(function () {
                this.resize(this.txt)
            }.bind(this), 0)
        }
    }

    resize(elmt) {
        if (!elmt) return
        elmt.style.height = "1px"
        elmt.style.height = (10+elmt.scrollHeight) + "px"
        if((10+elmt.scrollHeight) < this.props.style.height) {
            elmt.style.height = this.props.style.height + "px"
        }
    }

    onChange(e) {
        let value = e.target.value
        this.resize(e.target)
        this.setState({ value }, ()=>{
            if (typeof this.props.onChange == 'function') {
                this.props.onChange(value)
            }
        })
    }

    onClick(e) {
        if (typeof this.props.onClick == 'function') {
            this.props.onClick(e)
        }
    }

    refFn(c) {
        this.txt = c
        if (typeof this.props.innerRef == 'function') {
            this.props.innerRef(c)
        }
    }

    render() {
        return (
            <textarea
                ref={this.refFn}
                id={this.props.id}
                name={this.props.name}
                className={(this.props.className || '') + ' ims-resizeable-text'}
                style={this.props.style}
                onChange={this.onChange}
                onClick={this.onClick}
                value={this.state.value}
                placeholder={this.props.placeholder}
                onKeyPress={this.props.onKeyPress}
                title={this.props.title}></textarea>
        )
    }
}

ResizeableText.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClick: PropTypes.func,
    onKeyPress: PropTypes.func,
    innerRef: PropTypes.func,
    placeholder: PropTypes.string,
    title: PropTypes.string
}

ResizeableText.defaultProps = {
    id: "",
    name: "",
    className: "",
    value: "a",
    style: {height: 25},
    onChange: (e)=>{},
    onClick: (e)=>{},
    onKeyPress: (e)=>{},
    innerRef: (c)=>{},
    placeholder: "",
    title: ""
}

export default ResizeableText
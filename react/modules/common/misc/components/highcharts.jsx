/*
    <Highcharts
        config={{}}          highcharts config
        className=""         className for highcharts container
        style={}             style for highcharts container
    ></Highcharts>
*/

try {
    import React from 'react';;
} catch (err) {
    console.warn(err);
    var React = {};
    React.createClass = function() {};
}

var jsonEqual = function(a, b) {
    if (JSON.stringify(a) === JSON.stringify(b)) return true;
    return false;
};

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            config: {},
            className: '',
            style: {},
            chartRef: function(chart) {}
        };
    },
    highchartsId: 'highcharts-' + Date.now(),
    createChart: function(elementId, chartConfig) {
        try {
            if (!window.Highcharts) throw 'highcharts is not loaded';
            this.currentChart = window.Highcharts.chart(elementId, this.addDefaults(chartConfig));
            this.props.chartRef(this.currentChart);
        } catch (err) {
            console.warn(err);
        }
    },
    addDefaults: function(config) {
        config = config || {};
        config.credits = config.credits || {};
        if (!('enabled' in config.credits)) config.credits.enabled = false; // hide credits by default
        return config;
    },
    shouldComponentUpdate: function(nextProps) {
        if (!jsonEqual(this.props.config, nextProps.config)) this.createChart(this.highchartsId, nextProps.config);
        return false;
    },
    componentDidMount: function() {
        this.createChart(this.highchartsId, this.props.config);
    },
    render: function() {
        var className = this.props.className;
        var style = this.props.style;
        return (
            <div id={this.highchartsId} className={'highcharts ' + className} style={style}></div>
        );
    }
});
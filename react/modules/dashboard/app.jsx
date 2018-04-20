import React from 'react';
import ReactDom from 'react-dom';
import Store from './flux/store';
import Actions from './flux/actions';


var Dashboard = Store.connect(class Dashboard extends React.Component {
    componentDidMount() {
        Actions.setAppProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps) !== JSON.stringify(this.props))
            Actions.setAppProps(nextProps);
    }

    render() {
        return (
            <div></div>
        )
        var self=this;
        //check role
        var widgetBoxs = [];
        var isSecretary = false,
            isEditor = false,
            isReporter = false ,
            isStatistic = false,
            isFullPermission = (typeof imsConfig != "undefined" && typeof imsConfig.userInfo != "undefined" && imsConfig.userInfo.IsFullPermission && imsConfig.userInfo.IsFullZone);

        if (typeof imsConfig != "undefined" && typeof imsConfig.userPermissions != "undefined") {
            var permissions = imsConfig.userPermissions;

            isSecretary = permissions.some(function (item) {
                return (item.PermissionId == enumPermissions.ArticleAdmin);
            });

            isEditor = permissions.some(function (item) {
                return (item.PermissionId == enumPermissions.ArticleEditor);
            });

            isReporter = permissions.some(function (item) {
                return (item.PermissionId == enumPermissions.ArticleReporter);
            });

            isStatistic = permissions.some(function (item) {
                return (item.PermissionId == enumPermissions.Statistic);
            });

            if(isSecretary || isFullPermission || isStatistic){
                widgetBoxs.push(<StatisticRealtimeBox adtechNameSpace={self.props.adtechNameSpace} /> );
            }

            if(isSecretary || isFullPermission){
                widgetBoxs.push(<ListNewsByStatusBox status={enumNewsStatus.WaitForPublish} title="Bài chờ xuất bản" key={"boxnews_"+enumNewsStatus.WaitForPublish} />);//bài chờ xuất bản
            }

            if(isEditor || isFullPermission){
                widgetBoxs.push(<ListNewsByStatusBox status={enumNewsStatus.WaitForEdit} title="Bài chờ biên tập" key={"boxnews_"+enumNewsStatus.WaitForEdit} />);//bài chờ biên tập
            }
            else if(isReporter){
                widgetBoxs.push(<ListNewsByStatusBox status={enumNewsStatus.ReturnedToReporter} title="Bài bị trả lại" key={"boxnews_"+enumNewsStatus.ReturnedToReporter} />);//bài bị trả lại
            }

        }

        return (
            <div className="ims-page-wrap">
                <TopHeader title="Dashboard" />
                <div className="ims-page-content ims-dasboard">
                    {
                        widgetBoxs
                    }
                    <NewsHotBox top={5} day={7} />
                    <TagHotBox />
                    {
                        (isSecretary|| isFullPermission) ? <StatisticNewsYieldBox /> : null
                    }
                </div>
            </div>
        );
    }
}, appState => {
    return {
        formType: appState.formType,
    };
});

window.React.renderDashboard = function (props, el) {
    ReactDom.render(React.createElement(Dashboard, props), el);
};
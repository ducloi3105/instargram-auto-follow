var signalrNotify = require('../signal-notify/notify-hub');

// var STARTED = false;
// var startReceiving = function() {
//     signalrNotify.init(function() {
//         if (STARTED) return;
//         STARTED = true;

//         var preventDuplicate;
//         signalrNotify.addListener('notifyUpdateVideo', function(res) {
//             clearTimeout(preventDuplicate);
//             preventDuplicate = setTimeout(function() {
//                 console.warn('res', res);
//                 try { res = JSON.parse(res); } catch (err) { return console.warn(err); }
//                 if (!res.Success) return;
//             }, 0);
//         });
//     });
// };

var onNotification = function(callback) {
    callback = callback || function() {};
    signalrNotify.init(function() {
        var preventDuplicate;
        signalrNotify.addListener('notifyUpdateVideo', function(res) {
            // console.warn(res);
            clearTimeout(preventDuplicate);
            preventDuplicate = setTimeout(function() {
                try { res = JSON.parse(res); } catch (err) { return console.warn(err); }

                callback(res);
            }, 0);
        });

        signalrNotify.addListener('notifyVideoSuccess', function(res) {
            clearTimeout(preventDuplicate);
            preventDuplicate = setTimeout(function() {
                try { res = JSON.parse(res); } catch (err) { return console.warn(err); }

                callback(res);
            }, 0);
        });
    });
};

var notify = function(action, nextStatus, oldVideo, newVideo) {
    if (isNaN(parseInt(nextStatus))) throw new Error('must have');
    signalrNotify.init(function() {
        // console.warn('notifyVideo', {
        //     action: action,
        //     status: nextStatus,
        //     video: JSON.stringify({
        //         OldVideo: oldVideo || {},
        //         NewVideo: newVideo || {}
        //     }),
        //     user: window.imsConfig && imsConfig.currentUser || ''
        // });
        signalrNotify.invoke('notifyVideo', {
            action: action,
            status: nextStatus,
            video: JSON.stringify({
                OldVideo: oldVideo || {},
                NewVideo: newVideo || {}
            }),
            user: window.imsConfig && imsConfig.currentUser || ''
        });
    });
};

module.exports = {
    notify: notify,
    // startReceiving: startReceiving,
    onNotification: onNotification
};
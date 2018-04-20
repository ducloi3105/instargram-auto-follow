var signalrNotify = require('../signal-notify/notify-hub');

var onNotification = function(callback) {
    callback = callback || function() {};
    signalrNotify.init(function() {
        var preventDuplicate;
        signalrNotify.addListener('notifyUpdatePlaylist', function(res) {
            // console.warn(res);
            clearTimeout(preventDuplicate);
            preventDuplicate = setTimeout(function() {
                try { res = JSON.parse(res); } catch (err) { return console.warn(err); }

                callback(res);
            }, 0);
        });

        signalrNotify.addListener('notifyPlaylistSuccess', function(res) {
            clearTimeout(preventDuplicate);
            preventDuplicate = setTimeout(function() {
                try { res = JSON.parse(res); } catch (err) { return console.warn(err); }

                callback(res);
            }, 0);
        });
    });
};

var notify = function(action, nextStatus, oldPlaylist, newPlaylist) {
    if (isNaN(parseInt(nextStatus))) throw new Error('must have');
    signalrNotify.init(function() {
        signalrNotify.invoke('notifyPlaylist', {
            action: action,
            status: nextStatus,
            playlist: JSON.stringify({
                OldPlaylist: oldPlaylist || {},
                NewPlaylist: newPlaylist || {}
            }),
            user: window.imsConfig && imsConfig.currentUser || ''
        });
    });
};

module.exports = {
    notify: notify,
    onNotification: onNotification
};
var VID_ACTION = require('../helper/video-update-actions');

module.exports = function(video, action, onAllow, onDeny) {
    onAllow = onAllow || function() {};
    onDeny = onDeny || function() {};
    if (!video || video.constructor !== Object) throw new Error('video must be object');

    var actions = Object.keys(VID_ACTION).map(function(key) {
        return VID_ACTION[key];
    });
    if (actions.indexOf(action) === -1) return onDeny(), false;

    if (action === VID_ACTION.XuatBan) return onDeny(), false;

    if (action === VID_ACTION.GuiLen) {
        if (!video.ZoneId && (!video.PlaylistName || !video.PlaylistName.length)) {
            return onDeny(), false;
        }
    }

    return onAllow(), true;
};
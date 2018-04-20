var Misc = require('./functions-independent');
var MiscIMS = {};

MiscIMS.fixServerTime = function(param, revert) {
    // !!!! THIS FUNCTION WILL MUTATE ORIGINAL OBJECT / ARRAY !!!!
    // pass in obj to mutate every key that has date time (Z -> +0700)
    if (!param) return;
    var OFFSET = -7*60*60*1000;
    if (revert) OFFSET = -OFFSET;

    var fixObj = function(obj) {
        for (var key in obj) {
            var item = obj[key];
            if (item
                && item.constructor === String
                && item[item.length-1] === 'Z'
                && !isNaN((new Date(item)).getTime())
            ) {
                if (!revert) obj[key + '__original__'] = obj[key];
                obj[key] = (new Date(Date.parse(obj[key]) + OFFSET)).toISOString();

                var temp1 = Date.parse(obj[key]);
                if (isNaN(temp1) || temp1 <= 0) obj[key] = undefined;
            }
        }
    };
    if (param.constructor === Object) fixObj(param);
    if (param.constructor === Array) {
        param.forEach(function(o) { fixObj(o); });
    }
};

MiscIMS.fixServerData = function(param) { // fix 'null' and 'undefined' string in object from server
    // !!!! THIS FUNCTION WILL MUTATE ORIGINAL OBJECT / ARRAY !!!!
    if (!param) return;
    var fixObj = function(obj) {
        for (var key in obj) {
            var item = obj[key];
            if (item === 'null' || item === 'undefined') {
                obj[key] = '';
            } else if (item
                && item.constructor === String
                && item[item.length-1] === 'Z'
                && (new Date(item)).getTime() < 0
            ) {
                obj[key] = '';
            }
        };
    };
    if (param.constructor === Object) fixObj(param);
    if (param.constructor === Array) {
        param.forEach(function(p) { fixObj(p); });
    }
};

// MiscIMS.videoModalIsOpen = function() {
//     return Misc.existElement('section.ims-popup-full > div.ims-popup-item');
// };

MiscIMS.sessionSetJson = function(key, obj) {
    var Helper = require('../helper');
    if (!obj || (obj.constructor !== Array && obj.constructor !== Object)) throw new Error('sessionSetJson: must be Object or Array');
    Helper.setSessionData(key, JSON.stringify(obj));
};

MiscIMS.sessionGetJson = function(key) {
    var Helper = require('../helper');
    try {
        var data = JSON.parse(Helper.getSessionData(key));
        if (!data || (data.constructor !== Array && data.constructor !== Object)) throw ' ';
        return data;
    } catch (e) {
        return null;
    }
};

MiscIMS.sessionRemoveJson = require('../helper').removeSessionData;

MiscIMS.apiConstructor2 = (function() {
    /**
     * apiConstructor2('api/base/<baseApi>/<action>', true || false);
     * apiConstructor2({
     *     apiPathname: 'api/base/<baseApi>/<action>',
     *     method: 'GET' || 'POST', // default = 'POST'
     * });
     * apiConstructor2({
     *     url: 'http://<apiDomain>/<pathname>' || '/<pathname>',
     *     method: 'GET' || 'POST', // default = 'POST'
     * });
     */
    
    var cache = (function() {
        var cacheExpiry = 5*60*1000; // 0 -> never expire
        var memoryCache = {};

        var get = function(apiKey, paramsKey, cacheType) {
            var everything = {};
            if (cacheType === 'storage') {
                everything = MiscIMS.sessionGetJson(apiKey) || {};
            } else if (cacheType === 'memory') {
                everything = Misc.immutableClone(memoryCache[apiKey] || {});
            }
            var cached = everything[paramsKey] || {};
            if (!cached.timestamp) return null;
            if (cacheExpiry && Date.now() - cached.timestamp >= cacheExpiry) {
                delete memoryCache[apiKey][paramsKey];
                return null;
            }
            return cached.data;
        };
        var set = function(apiKey, paramsKey, data, cacheType) {
            var everything = {};
            var cached = { timestamp: Date.now(), data: data };
            if (cacheType === 'storage') {
                everything = MiscIMS.sessionGetJson(apiKey) || {};
                everything[paramsKey] = cached;
                MiscIMS.sessionSetJson(apiKey, everything);
            } else if (cacheType === 'memory') {
                everything = memoryCache[apiKey] || {};
                everything[paramsKey] = Misc.immutableClone(cached);
                memoryCache[apiKey] = everything;
            }
        };

        var clear = function(apiKey) {
            // clear all
            delete memoryCache[apiKey];
            MiscIMS.sessionRemoveJson(apiKey);
        };

        return {
            get: get,
            set: set,
            clear: clear
        };
    })();

    var processArguments = function(args) {
        var apiPathname, url, config, isGet;
        if (!args[0]) throw new Error('APIPATHNAME_OR_CONFIG undefined');
        if (args[0].constructor === String) {
            apiPathname = args[0];
            isGet = args[1];
        }
        if (args[0].constructor === Object) {
            config = args[0];
            apiPathname = config.apiPathname;
            url = config.url;
            isGet = config.method && config.method.toUpperCase() === 'GET';
        }
        if (apiPathname && url) throw new Error('only use either config.apiPathname or config.url, cant use both');
        if (apiPathname) {
            // apiPathname === 'api/base/<baseApi>/<action>'
            // apiPathname === 'api/extension/<extensionApi>/<action>'
            apiPathname = Misc.trimSlashes(apiPathname);
            if (apiPathname.split('/').length !== 4) throw new Error('invalid apiPathname: "' + apiPathname + '". Example format: "api/base/<baseApi>/<action>"');
        }
        return [apiPathname, url, isGet];
    };

    var apiConstructor = function() {
        var args = processArguments(arguments);
        var APIPATHNAME = args[0];
        var URL = args[1];
        var ISGET = args[2];
        var CACHE_MODE;

        var Helper = require('../helper');
        var API_KEY = ['apiConstructor', APIPATHNAME || URL, !!ISGET].join('_');

        var api = function(params, callback) {
            params = _processParams(params);
            var paramsKey = JSON.stringify(params);
            var _canceled = false;
            var self = {
                cancel: function() { _canceled = true; }
            };

            if (CACHE_MODE) {
                var cachedArguments = cache.get(API_KEY, paramsKey, CACHE_MODE);
                if (cachedArguments) {
                    setTimeout(function() { // mimic async
                        _callback.apply(null, cachedArguments);
                    }, 0);
                    return self;
                }
            }

            _callApi(params, function(err, res, msg) {
                _callback.apply(null, arguments);

                if (CACHE_MODE && !err) cache.set(API_KEY, paramsKey, [null, res, msg], CACHE_MODE);
            });

            return self;

            function _processParams(params) {
                params = params || {};
                if (params.constructor === Object || params.constructor === Array) {
                    params = Misc.immutableClone(params); // clear undefined + null values
                }
                return params;
            };
            function _callApi(params, cb) {
                var obj = {
                    method: 'POST',
                    params: params,
                    action: APIPATHNAME,
                    url: URL
                };
                if (ISGET && ISGET.toString().toUpperCase() !== 'POST') {
                    obj.method = 'GET';
                    delete obj.params;
                }
                try {
                    Helper.fetchData(obj).then(function(res) {
                        var readableMessage = '';
                        if (res && res.Message && res.Message.constructor === String) readableMessage = res.Message;
                        cb(null, res, readableMessage);
                    }, function fail(err) {
                        var readableMessage = '';
                        if (err && err.Message && err.Message.constructor === String) readableMessage = err.Message;
                        cb(err, null, readableMessage);
                    });
                } catch (err) {
                    cb(err, null);
                }
            };
            function _callback(err, res, msg) {
                MiscIMS.consoleLog(APIPATHNAME || URL, params, err || res);
                if (!_canceled) callback && callback(err, res, msg);
            };
        };

        api.allowCache = function(cacheMode) {
            // defaults to storage
            if (cacheMode !== 'memory' && cacheMode !== 'storage') cacheMode = 'storage';
            CACHE_MODE = cacheMode;
            return api;
        };

        api.clearCache = function() {
            // clear all
            cache.clear(API_KEY);
            return api;
        };

        return api;
    };

    apiConstructor.clearCacheOf = function() {
        var args = processArguments(arguments);
        var APIPATHNAME = args[0];
        var URL = args[1];
        var ISGET = args[2];
        var API_KEY = ['apiConstructor', APIPATHNAME || URL, !!ISGET].join('_');
        cache.clear(API_KEY);
    };

    return apiConstructor;
})();

MiscIMS.apiConstructor = function(BASEAPI, ACTION, ISGET) {
    /**
     * var something = MiscIMS.apiConstructor('media', 'something');
     * var somethingWithCache = MiscIMS.apiConstructor('media', 'something').allowCache(); // cache res based on req params
     * somethingWithCache.clearCache(); // clear all cache of media/something (all req of all params)
     * 
     * var apiCall = something(params, function(err, res, msg) {});
     * apiCall.cancel(); // cancel callback
     */
    return MiscIMS.apiConstructor2('api/base/' + BASEAPI + '/' + ACTION, ISGET);
};

MiscIMS.debugActions = function(actions) {
    try {
        var hostname = window.location.hostname;
    } catch (err) {}
    if (!Misc.isDebugging()) return actions;
    var actionsWithLogging = {};
    for (var action in actions) {
        (function(action) {
            actionsWithLogging[action] = function(details, moreDetails, evenMoreDetails) {
                var payload = {};
                if (details !== undefined) payload.details = details;
                if (moreDetails !== undefined) payload.moreDetails = moreDetails;
                if (evenMoreDetails !== undefined) payload.evenMoreDetails = evenMoreDetails;
                console.log('%c' + action, 'color:red; font-weight:bold', payload);
                actions[action].apply(null, arguments);
            };
        }(action))
    }
    window._DispatchAction = actionsWithLogging; // debug
    window._Actions = actionsWithLogging; // debug
    return actionsWithLogging;
};

MiscIMS.initVideoManager = (function() {
    var Helper = require('../helper');

    var func = function(callback) {
        callback = callback || function(err, res) {};

        preload(function(err) {
            if (err) return callback(err, null);

            IMSVideoManager.init({
                nameSpace: imsConfig.videoApiNameSpace,
                userName: imsConfig.currentUser,
                getTokenFunction: imsConfig.getVideoToken,
                params: {
                    defaultSource: (imsConfig.nameSpace === 'AutoPro' ? 'Trí Thức Trẻ' : ''),
                    maxSelected: 1,
                    callback: function(arrVideo) {
                        if (!arrVideo || arrVideo.constructor !== Array || !arrVideo.length) return callback(new Error('somethings wrong'));
                        var video = arrVideo[0];
                        callback(null, video);
                    }
                }
            });
        });
    };

    var LOADING = false;
    var preload = function(callback) {
        if (callback) Emitter.once('LOADED', callback);

        if (LOADING) return;
        LOADING = true;
        load(function(err) {
            LOADING = false;
            Emitter.emit('LOADED', err);
        });      
    };

    var load = function(callback) {
        callback = callback || function(err) {};

        if (window.IMSVideoManager && window.imsConfig) return callback(null);

        try {
            Helper.loadJs(imsConfig.widgetBasePath + '/video-manager.js');
            Helper.loadJs(imsConfig.widgetBasePath + '/photo-manager.js', function() {
                if (window.IMSVideoManager && window.imsConfig) callback(null);
                else callback(new Error('IMSVideoManager load failed'));
            });
        } catch (err) {
            callback(err);
        }
    };

    return Object.assign(func, { preload: preload });
})();

MiscIMS.initAvatarManager = (function() {
    var Helper = require('../helper');
    var EE = require('events').EventEmitter;
    var Emitter = new EE();

    var func = function(avatarUrl, width, height, callback) {
        callback = callback || function(err, imgInfo) {};

        preload(function(err) {
            if (err) return callback(err, null);

            IMSPlugins.AvatarManager.init({
                onSelected: function (data) {
                    if (!data || !data.url) return callback(new Error('error'));
                    data._url = data.url;
                    data.url = Helper.formatImage(data.url);
                    callback(null, data);
                },
                sourceAvatar: avatarUrl || '',
                currentAvatar: [{
                    url: avatarUrl || '',
                    dimensions: {
                        width: width,
                        height: height
                    },
                    type: 'photo',
                    title: ' ',
                    ratio: width/height,
                    label: ' '
                }]
            });
        });
    };

    var LOADING = false;
    var preload = function(callback) {
        if (callback) Emitter.once('LOADED', callback);

        if (LOADING) return;
        LOADING = true;
        load(function(err) {
            LOADING = false;
            Emitter.emit('LOADED', err);
        });      
    };

    var load = function(callback) {
        callback = callback || function(err) {};
        if (window.IMSPlugins && IMSPlugins.AvatarManager) return callback(null);
        
        Helper.loadJs(imsConfig.pluginBasePath + (window.React ? '/core-without-react.js' : '/core.js'), function() {
            if (!window.imsConfig || !window.IMSPlugins) return callback(new Error('load core failed'));
            
            try {
                IMSPlugins.Config['IMSNameSpace'] = imsConfig.nameSpace;
                IMSPlugins.Config['front_end_url'] = imsConfig.frontEndDomain;
                IMSPlugins.Config['image_thumb_domain'] = imsConfig.thumbImageDomain;
                IMSPlugins.Config['video_thumb_domain'] = imsConfig.thumbVideoDomain;
                IMSPlugins.Config['getTokenFunction'] = imsConfig.getToken;

                if (typeof IMSPlugins.Config['baseAjaxUrl'] == "undefined" || IMSPlugins.Config['baseAjaxUrl'].indexOf(imsConfig.apiDomain) == -1) {
                    IMSPlugins.Config['baseAjaxUrl'] = imsConfig.apiDomain + "/api/base/";
                }
            } catch (err) {
                return callback(err);
            }

            Helper.loadJs(imsConfig.pluginBasePath + "/avatarmanager.js", function() {
                if (window.IMSPlugins.AvatarManager) return callback(null);

                return callback(new Error('load AvatarManager failed'));
            });
        });
    }

    return Object.assign(func, { preload: preload });
})();

MiscIMS.initPhotoManager = (function() {
    var Helper = require('../helper');
    var EE = require('events').EventEmitter;
    var Emitter = new EE();

    var func = function(callback) {
        callback = callback || function(err, imgInfo) {};

        preload(function(err) {
            if (err) return callback(err, null);

            IMSPhotoManager.init({
                nameSpace: imsConfig.photoApiNameSpace,
                userName: imsConfig.currentUser,
                getTokenFunction: imsConfig.getPhotoToken,
                params: {
                    maxSelected: 1,
                    customPhotos: [],
                    maxImageWidthForUse: 10000,
                    callback: function(arrImage) {
                        if (!arrImage || !arrImage.length) return callback(new Error('error2'), null);
                        callback(null, arrImage[0]);
                    }
                }
            });
        });
    };

    var LOADING = false;
    var preload = function(callback) {
        if (callback) Emitter.once('LOADED', callback);

        if (LOADING) return;
        LOADING = true;
        load(function(err) {
            LOADING = false;
            Emitter.emit('LOADED', err);
        });      
    };

    var load = function(callback) {
        callback = callback || function(err) {};

        if (window.IMSPhotoManager && window.imsConfig) return callback(null);

        try {
            Helper.loadJs(imsConfig.widgetBasePath + '/photo-manager.js', function() {
                if (window.IMSPhotoManager && window.imsConfig) callback(null);
                else callback(new Error('IMSPhotoManager load failed'));
            });
        } catch (err) {
            callback(err);
        }
    };

    return Object.assign(func, { preload: preload });
})();

MiscIMS.disableConsoleLog = function() {
    // set window._debug = true to enable console.log
    try {
        var consoleLog = window.console.log;
        window.console.log = function() {
            if (Misc.isDebugging()) consoleLog.apply(null, arguments);
        };
        consoleLog('%c console.log disabled ', 'color: red; font-weight: bold; font-size: 15px;');
    } catch (err) {}
};

MiscIMS.consoleLog = function() {
    if (Misc.isDebugging()) console.log.apply(null, arguments);
};

MiscIMS.userHasPermission = function(permissionId, zoneId) {
    try {
        if (window.imsConfig.userInfo.IsFullPermission) return true;

        return window.imsConfig.userPermissions.some(function(permission) {
            if (!isNaN(parseInt(zoneId))) {
                return permission.PermissionId.toString() === permissionId.toString() && permission.ZoneId.toString() === zoneId.toString();
            }
            return permission.PermissionId.toString() === permissionId.toString();
        });
    } catch (err) {
        console.warn(err);
        return false;
    }
};

MiscIMS.showNotification = function(params) {
    var Helper = window.IMS && IMS.Helper || require('../helper');
    if (params && params.constructor === Object) {
        Helper.showNotification(params);
    } else if (params && params.constructor === String) {
        Helper.showNotification({
            message: params,
            level: 'success',
            position: 'topCenter'
        });
    }
};

MiscIMS.showAlert = function(params, params2, onClose) {
    var Helper = window.IMS && IMS.Helper || require('../helper');
    if (params && params.constructor === Object) {
        Helper.showModalDialog(params);
    } else if (params && params.constructor === String && (!params2 || params2.constructor === Function)) {
        params2 = params2 || function() {};
        Helper.showModalDialog({
            title: 'Thông báo',
            message: params,
            onClose: params2
        });
    } else if (params && params.constructor === String && params2 && params2.constructor === String) {
        onClose = onClose || function() {};
        Helper.showModalDialog({
            title: params,
            message: params2,
            onClose: onClose
        });
    }
};

module.exports = MiscIMS;
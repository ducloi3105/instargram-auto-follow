export default {
    nameSpace: 'micro_function_',
    loadCss: function (url, callback) {
        if (typeof url == 'undefined' || url == '')
            return;

        if (typeof (callback) != "function")
            callback = function () {
            };

        var cssList = [];
        if (url instanceof Array) {
            cssList = url;
        } else {
            cssList.push(url);
        }

        var linkCount = cssList.length;
        var head = document.getElementsByTagName('head')[0];
        var current = 0;
        cssList.forEach(function (url, i) {
            if (url.indexOf('?') != -1) {
                url = url.substr(0, url.indexOf('?'));
            }

            //url = url + '?v=' + (typeof imsConfig.version === 'undefined' ? '2.0.0.1' : imsConfig.version);

            if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1 && imsConfig.usedStaticDomain && url.endsWith('.css')) {
                url = imsConfig.staticsDomain + url;
            }

            var arr = document.querySelectorAll('link[href^="' + url + '"]');
            if (arr == null || arr.length == 0) {
                try {
                    var linkEl = document.createElement('link');
                    linkEl.rel = 'stylesheet';
                    linkEl.type = 'text/css';
                    linkEl.href = url + '?v=' + imsConfig.nameSpace.toLowerCase()+'.'+(typeof imsConfig.version === 'undefined' ? '2.0.0.1' : imsConfig.version);
                    linkEl.onload = linkEl.onreadystatechange = function () {
                        current++;
                        if (current == linkCount)
                            callback();
                    };
                    linkEl.addEventListener('error', function (err) {
                        console.log('load css error: ' + url);
                        head.removeChild(linkEl);

                        current++;
                        if (current == linkCount)
                            callback(err);
                    });
                    linkEl.media = 'all';
                    head.appendChild(linkEl);
                }
                catch (ex) {
                    current++;
                    if (current == linkCount)
                        callback(ex);
                }
            } else {
                current++;
                if (current == linkCount)
                    callback();
            }
        });

    },

    loadJs: (function() {
        /**
         * Helper.loadJs('/bundles/jquery.js', function() {console.log('loaded')});
         * Helper.loadJs(['/bundles/jquery.js', '/bundles/abc.js'], function() {console.log('loaded')});
         */
        var PARENT = document.getElementsByTagName('head')[0];
        var emitter = new EE();

        var processUrl = function(url) {
            if (url.indexOf('?') != -1) {
                url = url.substr(0, url.indexOf('?'));
            }

            //url + '?v=' + (window.imsConfig && imsConfig.version || '2.0.0.1');

            if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1 && imsConfig.usedStaticDomain && url.endsWith('.js')) {
                url = imsConfig.staticsDomain + url;
            }

            return url;
        };

        var appendScriptToParent = function(url, parent, callback) {
            try {
                var scriptEl = document.createElement('script');
                scriptEl.type = 'text/javascript';
                //scriptEl.async = true;
                scriptEl.src = url + '?v=' + imsConfig.nameSpace.toLowerCase()+'.'+(typeof imsConfig.version === 'undefined' ? '2.0.0.1' : imsConfig.version);
                scriptEl.onload = scriptEl.onreadystatechange = function () {
                    callback(null);
                };
                scriptEl.addEventListener('error', function (e) {
                    try {
                        parent.removeChild(scriptEl);
                    } catch (err) {}
                    callback('load js error: ' + url);
                });
                parent.appendChild(scriptEl);
            }
            catch (ex) {
                callback(ex);
            }
        };

        var loadingScripts = {};
        var loadSingle = function (url, callback) {
            if (!url) return callback('error: url empty or undefined');
            callback = callback || function() {};
            url = processUrl(url);

            emitter.once('scriptLoaded:' + url, callback);

            var scriptExisted = !!document.querySelector('script[src^="' + url + '"]');
            var scriptIsLoading = !!loadingScripts[url];

            if (scriptExisted && !scriptIsLoading) return emitter.emit('scriptLoaded:' + url, null);

            if (!scriptExisted) {
                loadingScripts[url] = true;
                appendScriptToParent(url, PARENT, function(err) {
                    delete loadingScripts[url];
                    emitter.emit('scriptLoaded:' + url, err || undefined);
                });
            }
        };

        return function(url, callback) {
            if (!url) return;
            callback = callback || function() {};

            var jsList = [].concat(url);

            var loaded = 0;
            jsList.forEach(function(url) {
                loadSingle(url, function(err) {
                    if (err) console.warn(err);
                    if (++loaded === jsList.length) callback();
                });
            });
        };
    })(),

    setSessionData(key, content, expireMinutes) {
        try {
            if (typeof (Storage) !== "undefined") {
                if (expireMinutes == undefined || expireMinutes == null || typeof expireMinutes == "string")
                    expireMinutes = 5;

                key = this.nameSpace + key;
                let expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + (expireMinutes * 60 * 1000));

                sessionStorage.setItem(key, JSON.stringify({value: content, expire: expireDate.getTime()}));
                return true;
            }
        } catch (ex) {
            console.warn('set session data by key ' + key + ' error', ex);
            return false;
        }

    },

    getSessionData(key) {
        try {
            if (typeof (Storage) !== "undefined") {
                key = this.nameSpace + key;
                let _value = sessionStorage.getItem(key);
                try {
                    if (_value != null && _value != "") {
                        let _jsonData = JSON.parse(_value);
                        if (typeof _jsonData.expire != 'undefined') {
                            let expireDate = _jsonData.expire;
                            if (expireDate < new Date().getTime()) {
                                sessionStorage.removeItem(key);

                                return "";
                            }
                        }

                        return typeof _jsonData.value != 'undefined' ? _jsonData.value : _value;
                    }
                    else {
                        return _value;
                    }
                }
                catch (ex) {
                    console.warn('get session data by key ' + key + ' error', ex);
                    return _value;
                }

            }
        } catch (e) {
            return "";
        }

    },

    removeSessionData(key) {
        try {
            if (typeof (Storage) !== "undefined") {
                key = this.nameSpace + key;
                sessionStorage.removeItem(key);

                return true;
            }
        } catch (e) {

        }

        return false;
    },

    setLocalData(key, content, expireMinutes) {
        try {
            if (typeof (Storage) !== "undefined") {
                if (expireMinutes == undefined || expireMinutes == null || typeof expireMinutes == "string")
                    expireMinutes = 5;

                key = this.nameSpace + key;
                let expireDate = new Date();
                expireDate.setTime(expireDate.getTime() + (expireMinutes * 60 * 1000));

                localStorage.setItem(key, JSON.stringify({value: content, expire: expireDate.getTime()}));
                return true;
            }
        } catch (ex) {
            console.warn('set session data by key ' + key + ' error', ex);
            return false;
        }

    },

    getLocalData(key) {
        try {
            if (typeof (Storage) !== "undefined") {
                key = this.nameSpace + key;
                let _value = localStorage.getItem(key);
                try {
                    if (_value != null && _value != "") {
                        let _jsonData = JSON.parse(_value);
                        if (typeof _jsonData.expire != 'undefined') {
                            let expireDate = _jsonData.expire;
                            if (expireDate < new Date().getTime()) {
                                localStorage.removeItem(key);

                                return "";
                            }
                        }

                        return typeof _jsonData.value != 'undefined' ? _jsonData.value : _value;
                    }
                    else {
                        return _value;
                    }
                }
                catch (ex) {
                    console.warn('get session data by key ' + key + ' error', ex);
                    return _value;
                }

            }
        } catch (e) {
            return "";
        }

    },

    removeLocalData(key) {
        try {
            if (typeof (Storage) !== "undefined") {
                key = this.nameSpace + key;
                localStorage.removeItem(key);

                return true;
            }
        } catch (e) {

        }

        return false;
    },

}
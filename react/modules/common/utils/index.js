export default {
    nameSpace: 'micro_function_',

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


    uniDecode: function (s) {
        if (!s || s.length === 0)
            return s;
        var sb = [];
        var UniChars = "àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệđìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆĐÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴÂĂĐÔƠƯ";
        var UniDecodeChars = "aaaaaaaaaaaaaaaaaeeeeeeeeeeediiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEDIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYAADOOU";

        s.split('').forEach(function (t) {
            var pos = UniChars.indexOf(t);
            sb.push(pos >= 0 ? UniDecodeChars[pos] : t);
        });
        return sb.join('');
    },
    randomIntFromTo(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
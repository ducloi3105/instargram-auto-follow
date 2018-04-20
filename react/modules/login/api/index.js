function postData(options) {
    return new Promise(function (resolve, reject) {

        var url = (typeof options.url != 'undefined' && options.url != '') ? options.url : '/Authenticate/' + options.action;
        var fetchOpts = {
            method: options.method || 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            },
        };

        if (options.params) {
            if (fetchOpts.method == 'GET') {
                fetchOpts.body = JSON.stringify(options.params);
            } else {
                if ('FormData' in window && FormData.prototype.isPrototypeOf(options.params)) {
                    fetchOpts.body = options.params;
                } else {
                    if (typeof options.params == 'object') {
                        var strParams = "";
                        for (var key in options.params) {
                            if (strParams != "") {
                                strParams += "&";
                            }

                            if (options.params[key] instanceof Date) {
                                strParams += key + "=" + encodeURIComponent(dateFormat(options.params[key], 'dd/mm/yyyy HH:MM'));
                            }
                            else {
                                strParams += key + "=" + encodeURIComponent(options.params[key]);
                            }
                        }
                        fetchOpts.body = strParams;
                    } else {
                        fetchOpts.body = options.params;
                    }
                }
            }
        }

        fetch(url, fetchOpts).then(function (response) {
            if (response.ok) {
                // Convert to JSON
                return response.json();
            } else {
                return {
                    Success: false,
                    Message: response,
                    ErrorCode: response.status
                };
            }
        }).then(function (jsonData) {
            resolve(jsonData);
        }).catch(function (error) {
            // If there is any error you will catch them here
            console.log('fetch data by url "' + url + '" error ' + error)
            reject({ Success: false, Message: 'Xảy ra lỗi khi gửi yêu cầu lên server' });
        });
    });
}
export default {
    action: 'api/extension/boxbottomembed/',


    getOtp (payload){
        return new Promise((rs,rj)=>{
            return postData({
                action: 'GetOTPCode',
                params: {
                    __RequestVerificationToken: payload.verifyToken,
                    otpType: payload.type
                }
            }).then((jsonData) => {
                if (jsonData.Success) {
                    rs({
                        data: jsonData.Data,
                        content: jsonData.Content,
                        errorCode: jsonData.ErrorCode,
                    });
                }
                else {
                    rj({
                        data: jsonData.Data,
                        content: jsonData.Content,
                        message: jsonData.Message,
                        errorCode: jsonData.ErrorCode,
                    });
                }
            }).catch(rj=>{
                rj({message: 'Lỗi gửi yêu cầu lên server'})
            });
        })
    },
    login(payload) {
        return new Promise((rs, rj) => {
            return postData({
                url: payload.url,
                params: {
                    __RequestVerificationToken: payload.verifyToken,
                    UserName: payload.userName,
                    Password: payload.password,
                    RememberMe: payload.remember,
                    Captcha: payload.captcha
                }
            }).then((jsonData) => {
                if (jsonData.Success) {
                    rs({
                        data: jsonData.Data,
                        content: jsonData.Content,
                        message: jsonData.Message,
                        errorCode: jsonData.ErrorCode,
                    });
                }
                else {
                    rj({
                        data: jsonData.Data,
                        content: jsonData.Content,
                        message: jsonData.Message,
                        errorCode: jsonData.ErrorCode,
                    });
                }
            }).catch(()=>{
                rs({
                    message: 'Lỗi gửi yêu cầu lên server'
                })
            });
        });
    },
    validateOtp(payload) {
        return new Promise((rs, rj) => {
            return  postData({
                action: 'ValidateOtp',
                params:{
                    verifyToken: payload.verifyToken,
                    __RequestVerificationToken: payload.verifyToken,
                    otp: payload.otp,
                    otpType: payload.type
                }
            }).then(function (jsonData) {
                if (jsonData.Success) {
                    rs({
                        data: jsonData.Data,
                        content: jsonData.Content,
                        errorCode: jsonData.ErrorCode,
                    });
                }
                else {
                    rj({
                        data: jsonData.Data,
                        content: jsonData.Content,
                        message: jsonData.Message,
                        errorCode: jsonData.ErrorCode,
                    });
                }
            }).catch(() => {
                rj({message: 'Lỗi gửi yêu cầu lên server'})
            });
        });
    }

}
export default {
    action: 'api/extension/boxbottomembed/',

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
    }

}
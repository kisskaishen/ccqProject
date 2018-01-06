// pages/center/bindTel.js
// 倒计时函数
var countdown = 60;
var settime = function (that) {
    if (countdown == 0) {
        that.setData({
            is_show: true,
            sendCodeText: '重新发送验证码'
        })
        countdown = 60;
        return;
    } else {
        that.setData({
            is_show: false,
            last_time: countdown
        })
        countdown--;
    }
    setTimeout(function () {
        settime(that)
    }, 1000)
}
// 手机号正则
let tel = /^1[34578]\d{9}$/;

// 获取实例
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: '',
        sendCodeText: '发送验证码',
        userName: '',         // 手机号
        captcha: '',          // 验证码
        captchaId: '',         // 验证码id
        is_show: true,        // 验证码按钮
        last_time: '',        // 判断验证码时间
        isLayerSuccess: true,
        isLayerFail: true,

        hasMemberName: '',           // 已有账号
    },
    // 输入的手机号
    userNameBlur: function (e) {
        if (tel.test(e.detail.value)) {
            this.setData({
                userName: e.detail.value,
            })
        } else {
            wx.showToast({
                title: '请输入正确的手机号',
                image: '/image/noResult.png',
            })
        }

    },
    // 输入验证码
    bindCaptcha: function (e) {
        this.setData({
            captcha: e.detail.value
        })
    },
    // 发送验证码
    sendCode: function (e) {
        let that = this
        if (tel.test(that.data.userName)) {
            wx.request({
                url: app.globalData.baseUrlV3 + 'Tool/phone_security',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    api_v: 'v3',
                    phone: this.data.userName,
                    member_id: that.data.userInfo.member_id,
                    log_type: 10
                },
                success: function (res) {
                    wx.showToast({
                        title: '发送成功',
                        icon: 'success',
                        duration: 2000
                    })
                    that.setData({
                        captchaId: res.data.log_id,
                        is_show: false,
                    })
                    settime(that);
                }
            })
        } else {
            wx.showToast({
                title: '请填写正确的手机号',
                image: '/image/noResult.png',
                duration: 2000
            })
        }
    },
    // 确定按钮
    loginBtnClick: function (type) {
        let that = this
        wx.request({
            url: app.globalData.baseUrlV3 + 'member/bind_phone',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                api_v: 'v3',
                token: that.data.userInfo.token,
                log_id: that.data.captchaId,
                code: that.data.captcha,
                type: 'type' || 0,
                member_id: that.data.userInfo.member_id,
                member_mobile: that.data.userName,
            },
            success: function (res) {
                if (res.data.code == 200) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 1600,
                        success: function () {
                            wx.switchTab({
                                url: '/pages/index/index',
                            })
                        }
                    })

                } else if (res.data.code == 302) {
                    that.setData({
                        isLayerFail: !that.data.isLayerFail,
                        hasMemberName: res.data.member_name
                    })
                } else if (res.data.code == 300) {
                    wx.showToast({
                        title: res.data.message,
                        image: '/image/noResult.png',
                        duration: 2000
                    })
                }

            }
        })
    },

    // 关联当前账号
    onNowTel: function () {
        this.loginBtnClick(1)
    },
    // 关联其他手机号码
    onOtherTel: function () {
        this.loginBtnClick(0)
    },

    


    // 开始新的旅程---跳转首页
    startIndex: function (e) {
        console.log(e)
        wx.switchTab({
            url: '/pages/index/index',
        })
    },






    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.setData({
            userInfo: wx.getStorageSync('userInfo2')
        })
    },
})
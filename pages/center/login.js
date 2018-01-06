// pages/center/login.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _num: 1,
        member_name: '',    // 登录账号
        member_passwd: '',  // 登录密码

        phone: '',          // 手机号
        log_id: '',          //验证码id
        code: '',            // 验证码


    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this

        wx.setNavigationBarTitle({
            title: '账号登录',
        })

    },
    // 账号/手机号
    memberNameChange(e) {
        this.setData({
            member_name: e.detail.value,
            phone: e.detail.value
        })
    },
    // 密码/验证码
    memberPwdChange(e) {
        this.setData({
            member_passwd: e.detail.value,
            code: e.detail.value
        })
    },
    // 切换登录
    changeNum(e) {
        let that = this
        that.setData({
            _num: e.target.dataset.num
        })
    },
    // 短信验证码
    sendCode() {
        let that = this
        wx.showLoading({
            title: '短信发送中',
        })
        wx.request({
            url: app.globalData.baseUrlV3 + 'Tool/phone_security',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            data: {
                api_v: 'v3',
                phone: that.data.phone,
                log_type: 1
            },
            success: function (res) {
                wx.hideLoading()
                if (res.data.code == 200) {
                    wx.showToast({
                        title: res.data.message,
                    })
                    that.setData({
                        log_id: res.data.log_id,
                    })
                } else {
                    wx.showToast({
                        title: res.data.message,
                        image: '/image/noResult.png',
                        duration: 1600
                    })
                }
            }
        })
    },
    // 登录
    loginBtn() {
        let that = this
        wx.showLoading({
            title: '登录中',
        })
        wx.request({
            url: app.globalData.baseUrlV2 + 'index/token',
            method: 'post',
            dataType: 'json',
            success: function (res) {
                if (that.data._num == 1) {
                    wx.request({
                        url: app.globalData.baseUrlV2 + 'index/login',
                        method: 'post',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        dataType: 'json',
                        data: {
                            member_name: that.data.member_name,
                            member_passwd: that.data.member_passwd,
                            token: res.data.token,
                            ctype: 3,
                            gtype: 1
                        },
                        success: function (res) {
                            wx.hideLoading()
                            if (res.data.code == 200) {
                                wx.setStorageSync(userInfo2, res.data.data)
                                wx.showLoading({
                                    title: '登陆成功',
                                })
                                wx.redirectTo({
                                    url: '/pages/center/index',
                                    success:function(){
                                        wx.hideLoading()
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: res.data.message,
                                    image: '/image/noResult.png',
                                    duration: 1600
                                })
                            }
                        }

                    })
                } else if (that.data._num == 2) {
                    wx.request({
                        url: app.globalData.baseUrlV2 + 'index/login_sms',
                        method: 'post',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        dataType: 'json',
                        data: {
                            member_mobile: that.data.phone,
                            code: that.data.code,
                            code_id: that.data.log_id,
                            token: res.data.token,
                            ctype: 3,
                            gtype: 1
                        },
                        success: function (res) {
                            wx.hideLoading()
                            if (res.data.code == 200) {
                                wx.setStorageSync('userInfo2', res.data.data)
                                wx.showLoading({
                                    title: '登陆成功',
                                })
                                wx.redirectTo({
                                    url: '/pages/center/index',
                                    success: function () {
                                        wx.hideLoading()
                                    }
                                })
                            } else {
                                wx.showToast({
                                    title: res.data.message,
                                    image: '/image/noResult.png',
                                    duration: 1600
                                })
                            }
                        }

                    })
                }

            }

        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
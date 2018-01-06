// pages/center/index.js
//获取应用实例
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        userInfo2: {},
        userInfo3: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        encryptedData:'',
        iv:''
    },
    // 绑定手机号
    bindTel: function (e) {
        wx.navigateTo({
            url: 'bindTel',
        })
    },
    // 点击套餐券
    toOrder: function () {
        wx.navigateTo({
            url: '/pages/order/index?_num=3',
        })
    },

    // 获取缓存
    getCenterInfo: function () {
        let that = this
        that.setData({
            userInfo2: wx.getStorageSync('userInfo2')
        })
        // 获取个人信息
        wx.request({
            url: app.globalData.baseUrlV3 + 'Member/member_center_index',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                api_v: 'v3',
                token: that.data.userInfo2.token,
                member_id: that.data.userInfo2.member_id
            },
            success: function (res) {
                wx.hideLoading()
                that.setData({
                    userInfo3: res.data.data
                })
                // console.log(that.data.userInfo3)
            }
        })
    },

    // 重新获取信息
    againGetUserInfo() {
        wx.showLoading({
            title: '获取中...',
        })
        let that = this
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            that.setData({
                                encryptedData: res.encryptedData,
                                iv:res.iv
                            })

                            // 登录
                            wx.login({
                                success: res => {
                                    // 请求后台接口传入code/encryptedData/iv,获取值
                                    wx.request({
                                        url: app.globalData.baseUrlV3 + 'Wxapplet/get_applet_member',
                                        method: 'post',
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        data: {
                                            code: res.code,
                                            encrypteddata: that.data.encryptedData,
                                            iv: that.data.iv,
                                        },
                                        success: function (res) {
                                            wx.showToast({
                                                title: '获取成功',
                                                icon:'success',
                                                duration:1600,
                                                success:function() {
                                                    wx.hideLoading()
                                                }
                                            })
                                            wx.setStorageSync('userInfo2', res.data.data)
                                            that.getCenterInfo()
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        let that = this
        wx.showLoading({
            title: '获取个人信息',
        })
        if (app.globalData.userInfo) {
            that.getCenterInfo()
            that.setData({
                userInfo: app.globalData.userInfo,
                userInfo2: app.globalData.userInfo2,
                hasUserInfo: true
            })
            console.log(that.data.userInfo2)
        } else if (that.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            let that = this
            that.getCenterInfo()
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }

        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    that.getCenterInfo()
                    app.globalData.userInfo = res.userInfo
                    that.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.userInfo2 = e.detail.userInfo2
        this.setData({
            userInfo: e.detail.userInfo,
            userInfo2: e.detail.userInfo2,
            hasUserInfo: true
        })
    },
    // 切换账号
    exitBtn() {
        wx.showActionSheet({
            itemList: ['切换账号'],
            success:function(res) {
                if (res.tapIndex == 0) {
                    wx.clearStorageSync()
                    wx.redirectTo({
                        url: '/pages/center/login',
                    })
                }
            }
        })
    },

    // 下拉更新
    onPullDownRefresh: function () {
        this.getCenterInfo()
        wx.showNavigationBarLoading() 
        setTimeout(function(){
            wx.hideNavigationBarLoading()
            wx.stopPullDownRefresh()
        },1200)
    }

})
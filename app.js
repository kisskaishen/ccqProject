//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        // 定位延时
        wx.showLoading({
            title: '定位中',
        })
        // 获取经纬度
        wx.getLocation({
            success: function (res) {
                wx.hideLoading()
                // 根据经纬度返回所在城市/地区
                wx.request({
                    url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=2GVBZ-7ZOW5-FZJII-QC6KI-5OM67-HGF4U',
                    data: {},
                    success: function (res) {
                        let address = {};
                        address.city = res.data.result.address_component.city.replace(/市/, '')
                        address.area = res.data.result.address_component.district.replace(/区/, '')
                        address.lat = res.data.result.location.lat
                        address.lng = res.data.result.location.lng
                        wx.setStorageSync('address', address)
                    }
                })

            },
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            this.globalData.encryptedData = res.encryptedData
                            this.globalData.iv = res.iv

                            // 登录
                            wx.login({
                                success: res => {
                                    let that = this
                                    // 请求后台接口传入code/encryptedData/iv,获取值
                                    wx.request({
                                        url: that.globalData.baseUrlV3 + 'Wxapplet/get_applet_member',
                                        method: 'post',
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        data: {
                                            code: res.code,
                                            encrypteddata: that.globalData.encryptedData,
                                            iv: that.globalData.iv,
                                        },
                                        success: function (res) {
                                            that.globalData.userInfo2 = res.data.data
                                            wx.setStorageSync('userInfo2', res.data.data)
                                        }
                                    })
                                }
                            })

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null,
        userInfo2: null,
        encryptedData: null,
        iv: null,
        baseUrlV2: 'https://app.28yun.com/index.php/webapi_v2/',
        baseUrlV3: 'https://app.28yun.com/index.php/webapi_v3/'
    }
})
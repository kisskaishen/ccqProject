
//获取应用实例
var app = getApp()
Page({
    data: {
        stores: [],                 // 店铺
        goods: [],               // 商品           
        resultValue: '',         // 查询结果
        type: '',                // type类型用于区分查询商家/商品
        city_id: '',             // 当前城市
    },
    // 点击搜索跳转
    bindSearch: function (e) {
        wx.navigateTo({
            url: 'search'
        })
    },

    onLoad: function (options) {
        var that = this;
        that.setData({
            type: options.type,
            resultValue: options.keyword
        })
        wx.getStorage({
            key: 'city_id',
            success: function (res) {
                that.setData({
                    city_id: res.data
                })
            },
        })
        console.log(app.globalData.baseUrlV3)
        // 获取当前经纬度
        wx.getLocation({
            success: function (res) {
                let latitude = res.latitude
                let longitude = res.longitude
                // 返回结果
                if (that.data.type == 1) {
                    wx.request({
                        url: app.globalData.baseUrlV3 + 'Wxchat/nearby_store',
                        method: 'post',
                        data: {
                            lat1: latitude,
                            lng1: longitude,
                            store_name: that.data.resultValue
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            if (res.data.code == 200) {
                                that.setData({
                                    stores :res.data.data
                                })
                            } else {
                                wx.showToast({
                                    title: res.data.message,
                                    image: '/image/noResult.png',
                                    duration: 2400
                                })
                            }

                        }
                    })
                } else {
                    wx.request({
                        url: app.globalData.baseUrlV3 + 'Wxchat/ccq_coupon',
                        method: 'post',
                        data: {
                            lat1: latitude,
                            lng1: longitude,
                            goods_name: that.data.resultValue
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            if (res.data.code == 200) {
                                that.setData({
                                    goods: res.data.data
                                })
                            } else {
                                wx.showToast({
                                    title: res.data.message,
                                    image: '/image/noResult',
                                    duration: 1800
                                })
                            }

                        }
                    })
                }

            },
        })

    },


})

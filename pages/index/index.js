//index.js
//获取应用实例
var app = getApp()
Page({
    data: {
        cityRange: [],
        cityId: '',
        cityIndex: '',
        isCity: true,
        nowCity: '',             // 显示的现在的city
        foodRange: ['正餐', '下午茶', '宵夜'],
        foodIndex: 0,
        goods: [],
        windowH: '',             // 系统高度
        page: 1,
        locationInfo: ''
    },

    // 页面初加载
    onLoad: function () {
        let that = this
        // 获取系统窗口高度
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowH: res.windowHeight
                })
            },
        })
        that.loadInfo();
    },
    // 城市选择
    changeCity: function (e) {
        let that = this
        that.setData({
            cityIndex: e.detail.value,
            isCity: false,
            nowCity: that.data.cityRange[that.data.cityIndex]
        })
        that.data.nowCity = that.data.cityRange[that.data.cityIndex].title
        // 根据改变后的城市请求商家列表信息
        wx.getStorage({
            key: 'address',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrlV3 + 'Wxchat/ccq_discount_coupon',
                    method: 'post',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        lat1: res.data.lat,
                        lng1: res.data.lng,
                        city_id: that.data.nowCity,
                        page: 1,
                    },
                    success: function (res) {
                        if (res.data.code == 200) {
                            that.setData({
                                goods: res.data.data
                            })
                        } else {
                            that.setData({
                                goods: []
                            })
                            wx.showToast({
                                title: res.data.message,
                                image: '/image/noResult.png',
                                duration: 2000
                            })
                        }
                    }
                })
            },
        })
    },
    // 点击搜索跳转
    bindSearch: function (e) {
        wx.navigateTo({
            url: '/pages/index/search'
        })
    },
    // 服务分类选择
    changeFood: function (e) {
        this.setData({
            foodIndex: e.detail.value
        })
    },
    // 获取信息的函数
    loadInfo: function (page) {
        let that = this;
        // 获取已开通城市（此时不需要地理位置信息）
        wx.request({
            url: app.globalData.baseUrlV2 + 'Unionstore/get_city_list',
            method: 'post',
            success: function (res) {
                that.setData({
                    cityRange: res.data.data,
                })
            }
        })
        // 读取localStorage存储的地址信息
        that.setData({
            locationInfo: wx.getStorageSync('address'),
            nowCity: that.data.locationInfo.city || '深圳'
        })
        // 根据读取的经纬度请求商家列表信息
        wx.request({
            url: app.globalData.baseUrlV3 + 'Wxchat/ccq_discount_coupon',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                lat1: that.data.locationInfo.lat || 22.743067,
                lng1: that.data.locationInfo.lng || 113.836884,
                city_id: that.data.nowCity,
                page: page,
            },
            success: function (res) {
                wx.hideLoading()
                if (res.data.code == 200) {
                    if (that.data.goods.length == 0) {
                        that.setData({
                            goods: res.data.data
                        })
                    } else {
                        that.setData({
                            goods: that.data.goods.concat(res.data.data)
                        })
                    }
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
    // 滚动到底部触发加载
    scrollBottom: function (e) {
        let that = this
        that.setData({
            page: that.data.page + 1
        })
        wx.showLoading({
            title: '加载中',
        })
        // 根据读取的经纬度请求商家列表信息
        wx.request({
            url: app.globalData.baseUrlV3 + 'Wxchat/ccq_discount_coupon',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                lat1: that.data.locationInfo.lat || 22.743067,
                lng1: that.data.locationInfo.lng || 113.836884,
                city_id: that.data.nowCity,
                page: that.data.page,
            },
            success: function (res) {
                wx.hideLoading()
                if (res.data.code == 200) {
                    if (that.data.goods.length == 0) {
                        that.setData({
                            goods: res.data.data
                        })
                    } else {
                        that.setData({
                            goods: that.data.goods.concat(res.data.data)
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        image: '/image/noResult.png',
                        duration: 2000
                    })
                }
            }
        })
    },
    // 下拉加载
    onReachBottom: function (e) {
        let that = this
        that.setData({
            page: that.data.page + 1
        })
        wx.showLoading({
            title: '加载中',
        })
        // 根据读取的经纬度请求商家列表信息
        wx.request({
            url: app.globalData.baseUrlV3 + 'Wxchat/ccq_discount_coupon',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                lat1: that.data.locationInfo.lat || 22.743067,
                lng1: that.data.locationInfo.lng || 113.836884,
                city_id: that.data.nowCity,
                page: that.data.page,
            },
            success: function (res) {
                wx.hideLoading()
                if (res.data.code == 200) {
                    if (that.data.goods.length == 0) {
                        that.setData({
                            goods: res.data.data
                        })
                    } else {
                        that.setData({
                            goods: that.data.goods.concat(res.data.data)
                        })
                    }
                } else {
                    wx.showToast({
                        title: res.data.message,
                        image: '/image/noResult.png',
                        duration: 2000
                    })
                }
            }
        })
    },

    // 下拉刷新
    onPullDownRefresh:function(e) {
        // wx.showNavigationBarLoading()
        this.loadInfo(1)
        wx.stopPullDownRefresh()
    }
})

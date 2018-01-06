// pages/detail/index.js
// 获取实例
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsId: '',

        city: '',
        area: '',
        ccqStar: '',
        ccqStarNum: '',

        goodsInfo: '',
        storeInfo: '',
        imageInfo: '',
        detailInfo: [],
        otherInfo: '',
        recommendList: [],           // 推荐商品
        page: 1,
    },

    // 打开地图
    openMap() {
        let that = this
        wx.openLocation({
            latitude: parseFloat(that.data.storeInfo.latitude),
            longitude: parseFloat(that.data.storeInfo.longitude),
            name: that.data.goodsInfo.store_name,
            address: that.data.storeInfo.live_store_address
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            goodsId: options.goods_id
        })

        var address = wx.getStorageSync('address')
        console.log(address)

        wx.request({
            url: app.globalData.baseUrlV3 + 'Goods/ccq_goods',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                api_v: 'v3',
                goods_id: that.data.goodsId,
                lat1: address.lat,
                lng1: address.lng,
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        goodsInfo: res.data.data.goods_info,
                        storeInfo: res.data.data.store_info,
                        detailInfo: res.data.data.goods_bunding_group,
                        otherInfo: res.data.data.goods_bunding_info,
                        imageInfo: res.data.data.goods_image_mobile[0],

                        ccqStar: res.data.data.goods_info.evaluation_good_star,
                        ccqStarNum: parseInt(res.data.data.goods_info.evaluation_good_star),
                    })
                    if (that.data.goodsInfo.store_name == '') {
                        wx.setNavigationBarTitle({
                            title: '商品详情',
                        })
                    } else {
                        wx.setNavigationBarTitle({
                            title: that.data.goodsInfo.goods_name,
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


        that.recommendList(1)
    },
    // 推荐商品列表
    recommendList: function (page) {
        let that = this
        wx.getStorage({
            key: 'address',
            success: function (res) {
                that.setData({
                    city: res.data.city,
                    area: res.data.area
                })
                wx.getLocation({
                    success: function (res) {
                        wx.request({
                            url: app.globalData.baseUrlV3 + 'Goods/referral_goods',
                            method: 'post',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                api_v: 'v3',
                                goods_id: that.data.goodsId,
                                lat1: res.latitude,
                                lng1: res.longitude,
                                city_id: that.data.city,
                                narea_s_name: that.data.area,
                                goods_images_op: '!m',
                                goods_images_size: '750x375',
                                page: that.data.page,
                                page_size: 4
                            },
                            success: function (res) {
                                wx.hideLoading()
                                if (res.data.code == 200) {
                                    if (res.data.data.length == 0) {
                                        that.setData({
                                            recommendList: res.data.data
                                        })
                                    } else {
                                        that.setData({
                                            recommendList: that.data.recommendList.concat(res.data.data)
                                        })
                                    }
                                } else {
                                    wx.showToast({
                                        title: res.data.message,
                                        image: '/pages/noResult.png',
                                        duration: 1600
                                    })
                                }

                            }
                        })
                    },
                })
            },
        })
    },

    toTel: function () {
        let that = this
        wx.makePhoneCall({
            phoneNumber: that.data.storeInfo.live_store_tel,
        })
    },

    /**
  * 页面上拉触底事件的处理函数
  */
    onReachBottom: function () {
        let that = this
        that.setData({
            page: that.data.page + 1
        })
        wx.showLoading({
            title: '加载中',
        })
        that.recommendList(that.data.page)
    },


})
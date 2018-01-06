// pages/detail/store.js
// 获取实例
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeInfo: '',       // 商家信息
        storeList: '',      // 推荐商家
        store_id: '',        // 商家id
        ccqStarNum: '',          // 星星
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        that.setData({
            store_id: options.store_id
        })
        // 商家信息
        wx.request({
            url: app.globalData.baseUrlV3 + 'Ccqstore/ccq_store',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                api_v: 'v3',
                store_id: options.store_id
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        storeInfo: res.data.data,
                        ccqStarNum: res.data.data.store_teat
                    })
                    wx.setNavigationBarTitle({
                        title: that.data.storeInfo.store_name,
                    })
                } else {
                    wx.showToast({
                        title: res.data.messag,
                        image: '/image/noResult.png',
                        duration: 1600
                    })
                }

            }
        })

        // 推荐商家
        wx.request({
            url: app.globalData.baseUrlV3 + 'Ccqstore/ccq_store_goods_list',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                api_v: 'v3',
                store_id: options.store_id,
                page: 1

            },
            success: function (res) {
                console.log(res.data.data)
                if (res.data.code == 200) {
                    that.setData({
                        storeList: res.data.data
                    })
                } else {
                    console.log(res.data.message)
                }

            }
        })


    },

    // 拨打电话
    toTel() {
        let that = this
        wx.makePhoneCall({
            phoneNumber: that.data.storeInfo.live_store_tel
        })
    }
})
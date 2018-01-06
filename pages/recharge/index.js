// pages/recharge/index.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        token: '',
        memberId: '',
        userInfo: '',
        list: [],
        order_id: '',
        order_sn: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        wx.getStorage({
            key: 'userInfo2',
            success: function (res) {
                that.setData({
                    token: res.data.token,
                    memberId: res.data.member_id
                })
                wx.request({
                    url: app.globalData.baseUrlV2 + 'Membervip/my_vip',
                    method: 'post',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        token: that.data.token,
                        member_id: that.data.memberId
                    },
                    success: function (res) {
                        that.setData({
                            userInfo: res.data.data,
                            list: res.data.data.list
                        })
                    }
                })
            },
        })
    },

    toPay: function (e) {
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        wx.login({
            success: function (res) {
                that.setData({
                    code: res.code
                })
            }
        })
        wx.request({
            url: app.globalData.baseUrlV2 + 'buy/buy_step2',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                token: that.data.token,
                member_id: that.data.memberId,
                ifcart: 4,
                cart_id: '101552|' + e.target.dataset.total,
                address_id: 1,
                pay_name: 'online',
                pay_code: 12
            },
            success: function (res) {
                wx.hideToast()
                that.setData({
                    order_id: res.data.pay_info.order_id,
                    order_sn: res.data.order_sn
                })
                wx.request({
                    url: app.globalData.baseUrlV2 + 'Pay/WeixinRequest',
                    method: 'get',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        order_sn: res.data.order_sn,
                        order_amount: res.data.pay_info.order_amount,
                        type: 1,
                        code: that.data.code
                    },
                    success: function (res) {
                        wx.requestPayment({
                            timeStamp: res.data.data.timestamp,
                            nonceStr: res.data.data.noncestr,
                            package: 'prepay_id=' + res.data.data.prepayid,
                            signType: 'MD5',
                            paySign: res.data.data.paysign,
                            success: function (res) {
                                wx.navigateTo({
                                    url: '/pages/order/detail?order_id' + that.data.order_id,
                                })
                            },
                            fail: function (err) {
                                wx.showToast({
                                    title: '已取消支付',
                                    icon: 'success',
                                    duration: 1600
                                })
                            }
                        })
                    }
                })
            }
        })
    }


})
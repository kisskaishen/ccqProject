// pages/payOrder/index.js
// 获取实例
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsId: '',
        storeInfo: '',       // 商家信息
        goodsInfo: '',       // 商品信息
        memberInfo: '',      // 个人信息
        token: '',
        code: '',
        order_id: '',
        order_sn: '',
    },

    // 去支付
    toPay(e) {
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
                member_id: that.data.member_id,
                ifcart: 3,
                cart_id: that.data.goodsId + '|1',
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
                                    url: '/pages/order/index'
                                })
                            },
                            fail: function (err) {
                                wx.navigateTo({
                                    url: '/pages/order/index',
                                })
                            }
                        })
                    }
                })
            }
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
        wx.getStorage({
            key: 'userInfo2',
            success: function (res) {
                console.log(res)
                that.setData({
                    token: res.data.token,
                    member_id: res.data.member_id
                })
                wx.request({
                    url: app.globalData.baseUrlV2 + 'Buy/buy_step1',
                    method: 'post',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        token: res.data.token,
                        member_id: that.data.member_id,
                        cart_id: that.data.goodsId + '|1',
                        ifcart: 3,
                    },
                    success: function (res) {
                        that.setData({
                            storeInfo: res.data.buy_list.store_info,
                            goodsInfo: res.data.buy_list.store_cart_list[0].goods_list[0],
                            memberInfo: res.data.buy_list.member_info
                        })
                    }
                })
            },
        })
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
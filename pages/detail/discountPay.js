// pages/detail/discountPay.js
// 获取实例
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        discount: '',              // 折扣
        store_name: '',            // 商家名称
        moneyValue: '',            // 输入金额
        reallyMoney: '',           // 实际金额

        token: '',
        member_id: '',
        store_id: '',            // 商家id
        code: '',
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
                    member_id: res.data.member_id
                })
            },
        })
        that.setData({
            discount: options.discount,
            store_name: options.store_name,
            store_id: options.store_id
        })
        wx.setNavigationBarTitle({
            title: that.data.store_name,
        })
    },
    // 输入金额
    moneyInput(e) {
        let that = this
        that.setData({
            reallyMoney: e.detail.value * that.data.discount / 10
        })
    },
    // 支付
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
                ifcart: 2,
                store_id: that.data.store_id,
                pay_bill_amount: that.data.reallyMoney,
                cart_id: '101552|1',
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
                                wx.navigateTo({
                                    url: '/pages/order/index',
                                })
                            }
                        })
                    }
                })
            }
        })
    }


})
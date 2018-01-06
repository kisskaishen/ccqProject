// pages/order/index.js
// 获取实例
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _num: 2,
        list: [],            // 全部订单
        page: 1,
        userInfo: '',
        code: '',
    },

    // 再买一单
    buyAgain(e) {
        wx.navigateTo({
            url: '/pages/payOrder/index?goods_id=' + e.target.dataset.goods_id,
        })
    },
    // 去付款
    toPay(e) {
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        wx.login({
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrlV2 + 'Pay/WeixinRequest',
                    method: 'get',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        order_sn: e.target.dataset.order_sn,
                        order_amount: e.target.dataset.goods_amount,
                        type: 1,
                        code: res.code
                    },
                    success: function (res) {
                        wx.hideLoading()
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
    },
    // 删除订单
    deleteOrder: function (e) {
        let that = this
        wx.showLoading({
            title: '删除中',
        })
        wx.getStorage({
            key: 'userInfo2',
            success: function (res) {
                that.setData({
                    userInfo: res.data
                })
                wx.request({
                    url: app.globalData.baseUrlV2 + 'Memberorder/order_del',
                    method: 'post',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        token: res.data.token,
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function (res) {
                        if (res.data.code == 200) {
                            wx.hideLoading()
                            wx.showToast({
                                title: '删除成功',
                                success: function () {
                                    wx.redirectTo({
                                        url: '/pages/order/index',
                                    })
                                }
                            })

                        } else {
                            wx.showToast({
                                title: '删除失败',
                                image: '/image/noResult.png'
                            })

                        }
                    }
                })
            }
        })
    },
    // 点击切换上部导航栏                                                                                                
    headerClick(e) {
        let that = this
        that.setData({
            _num: e.target.dataset.num,
            page: 1
        })

        if (e.target.dataset.num == 1) {
            wx.showLoading({
                title: '查看全部',
            })
            wx.request({
                url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    api_v: 'v3',
                    goods_images_op: '!m',
                    goods_images_size: '220x180',
                    token: that.data.userInfo.token,
                    member_id: that.data.userInfo.member_id,
                    page: 1
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.code == 200) {
                        that.setData({
                            list: res.data.data
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
        } else if (e.target.dataset.num == 2) {
            wx.showLoading({
                title: '待付款',
            })
            wx.request({
                url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    api_v: 'v3',
                    goods_images_op: '!m',
                    goods_images_size: '220x180',
                    token: that.data.userInfo.token,
                    member_id: that.data.userInfo.member_id,
                    order_state: 10,
                    page: 1
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.code == 200) {
                        that.setData({
                            list: res.data.data
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

        } else if (e.target.dataset.num == 3) {
            wx.showLoading({
                title: '待使用',
            })
            wx.request({
                url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    api_v: 'v3',
                    goods_images_op: '!m',
                    goods_images_size: '220x180',
                    token: that.data.userInfo.token,
                    member_id: that.data.userInfo.member_id,
                    order_state: 20,
                    union_type: 3,
                    page: 1
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.code == 200) {
                        that.setData({
                            list: res.data.data
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
        } else {
            wx.showLoading({
                title: '待评价',
            })
            wx.request({
                url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    api_v: 'v3',
                    goods_images_op: '!m',
                    goods_images_size: '220x180',
                    token: that.data.userInfo.token,
                    member_id: that.data.userInfo.member_id,
                    order_state: 40,
                    evaluation_state: 0,
                    page: 1
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.code == 200) {
                        that.setData({
                            list: res.data.data
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
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        wx.showLoading({
            title: '我的订单',
        })
        wx.getStorage({
            key: 'userInfo2',
            success: function (res) {
                that.setData({
                    userInfo: res.data
                })
                wx.hideLoading()
                if (options._num == 3) {
                    that.setData({
                        _num : options._num
                    })
                    wx.request({
                        url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                        method: 'post',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            api_v: 'v3',
                            goods_images_op: '!m',
                            goods_images_size: '220x180',
                            token: that.data.userInfo.token,
                            member_id: that.data.userInfo.member_id,
                            order_state: 20,
                            union_type: 3,
                            page: 1
                        },
                        success: function (res) {
                            wx.hideLoading()
                            if (res.data.code == 200) {
                                that.setData({
                                    list: res.data.data
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
                } else {
                    wx.request({
                        url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                        method: 'post',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                            api_v: 'v3',
                            goods_images_op: '!m',
                            goods_images_size: '220x180',
                            token: res.data.token,
                            member_id: res.data.member_id,
                            order_state: 10,
                            page: 1
                        },
                        success: function (res) {
                            if (res.data.code == 200) {
                                that.setData({
                                    list: res.data.data
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

            },
        })

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        wx.showLoading({
            title: '加载中',
        })
        let that = this
        that.setData({
            page: that.data.page += 1
        })
        if (that.data._num == 1) {
            let page = that.data.page
            wx.request({
                url: app.globalData.baseUrlV2 + 'Memberorder/order_list',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    token: that.data.userInfo.token,
                    member_id: that.data.userInfo.member_id,
                    page: that.data.page
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.code == 200) {
                        that.setData({
                            list: that.data.list.concat(res.data.data)
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
                url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    api_v: 'v3',
                    goods_images_op: '!m',
                    goods_images_size: '220x180',
                    token: that.data.userInfo.token,
                    member_id: that.data.userInfo.member_id,
                    order_state: 10,
                    page: that.data.page
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.code == 200) {
                        that.setData({
                            list: that.data.list.concat(res.data.data)
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
        } else if (that.data._num == 3) {
            wx.request({
                url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    api_v: 'v3',
                    goods_images_op: '!m',
                    goods_images_size: '220x180',
                    token: that.data.userInfo.token,
                    member_id: that.data.userInfo.member_id,
                    order_state: 20,
                    union_type: !3,
                    page: that.data.page
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.code == 200) {
                        that.setData({
                            list: that.data.list.concat(res.data.data)
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
        } else if (that.data._num == 4) {
            wx.request({
                url: app.globalData.baseUrlV3 + 'Memberorder/order_list',
                method: 'post',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    api_v: 'v3',
                    goods_images_op: '!m',
                    goods_images_size: '220x180',
                    token: that.data.userInfo.token,
                    member_id: that.data.userInfo.member_id,
                    order_state: 40,
                    evaluation_state: 0,
                    page: that.data.page
                },
                success: function (res) {
                    wx.hideLoading()
                    if (res.data.code == 200) {
                        that.setData({
                            list: that.data.list.concat(res.data.data)
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




    },
})
// pages/detail/eval.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        evalInfo: '',
        list: [],
        _num: '1',
        store_id: '',
        goods_id: '',
        page: 1
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let that = this
        that.setData({
            store_id: options.store_id,
            goods_id: options.goods_id
        })
        wx.showLoading({
            title: '加载中',
        })
        that.getEvalList(0)
    },
    // getEvalList
    getEvalList(re_type, page) {
        let that = this
        wx.request({
            url: app.globalData.baseUrlV3 + 'Ccqstore/ccq_store_evaluate',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                api_v: 'v3',
                store_id: that.data.store_id || '',
                goods_id: that.data.goods_id || '',
                re_type: re_type,
                page: that.data.page
            },
            success: function (res) {
                if (res.data.code == 200) {
                    wx.hideLoading()
                    if (that.data.list.length == 0) {
                        that.setData({
                            evalInfo: res.data.data,
                            list: res.data.data.list,
                        })
                    } else {
                        that.setData({
                            evalInfo: res.data.data,
                            list: that.data.list.concat(res.data.data.list),
                        })
                    }

                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: res.data.message,
                        image: '/image/noResult.png',
                        duration: 1600
                    })
                }
            }
        })
    },
    // 评价
    headerClick(e) {
        let that = this
        that.setData({
            _num: e.currentTarget.dataset.num,
            page: 1,
            list: []
        })
        wx.showLoading({
            title: '加载中',
        })
        that.getEvalList((e.currentTarget.dataset.num - 1), that.data.page)
    },

    // 评价翻页
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
        that.getEvalList((that.data._num - 1), that.data.page)
    },






})
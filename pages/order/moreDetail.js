// pages/order/moreDetail.js
var app = getApp();
// formatDate(time) {
//     // 时间戳转日期
//     let date = new Date(parseInt(time) * 1000).toLocaleString().replace(/年|月/g, '-').replace(/日/g, '-')
//     return date
// }
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderInfo: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        wx.getStorage({
            key: 'userInfo2',
            success: function (res) {
                wx.request({
                    url: app.globalData.baseUrlV2 + 'Memberorder/order_one',
                    method: 'post',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        token: res.data.token,
                        order_id: options.order_id,
                        type: 1
                    },
                    success: function (res) {
                        console.log(res.data.data)
                        that.setData({
                            orderInfo: res.data.data
                        })
                    }
                })
            },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

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
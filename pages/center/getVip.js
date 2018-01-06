// pages/center/getVip.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo2:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that =this
        that.setData({
            userInfo2: wx.getStorageSync('userInfo2')
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

    },



    // 领取vip
    getBtn: function () {
        let that = this
        wx.showLoading({
            title: '领取中',
        })
        wx.request({
            url: app.globalData.baseUrlV3 + 'Event/give_vip',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                api_v: 'v3',
                token: that.data.userInfo2.token,
                member_id: that.data.userInfo2.member_id
            },
            success: function (res) {
                wx.hideLoading()
                if (res.data.code == 200) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    })
                    setTimeout(function(){
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    },2000)
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: '/image/noResult.png',
                        duration: 2000
                    })
                }

            }
        })
    }

})
// pages/order/detail.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderInfo:'',
    },
    // 重定向返回首页
    toIndex() {
        wx.switchTab({
            url: '/pages/index/index',
        })
    },
    toOrder(){
        wx.redirectTo({
            url: '/pages/order/index',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let that = this
        wx.request({
            url: app.globalData.baseUrlV2 + 'memberorder/checkqrcode',
            method:'post',
            header:{
                'content-type':'application/x-www-form-urlencoded'
            },
            data:{
                order_id: options.order_id
            },
            success:function(res) {
                if(res.data.code == 200) {
                    that.setData({
                        orderInfo:res.data.data
                    })
                    console.log(123123)
                    console.log(that.data.orderInfo)
                } else {
                    wx.showToast({
                        title: res.data.message,
                        image:'/image/noResult.png',
                        duration:1600
                    })
                }                
            },
            fail:function(error){
                console.log(error)
            }
        })
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh()
    },

    


})
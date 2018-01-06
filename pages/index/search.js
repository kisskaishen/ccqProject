// pages/index/search.js
// 获取实例
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        typeRange: ['商家', '抢券'],
        type: 0,
        searchType: 1,
        searchInfo: '',        // 热门搜索
        inputValue: '',          // 输入的input框的值
        historyValue: [],        // 历史记录的数组

    },
    // 获取input框中的值
    bindInputValue(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    // 点击搜索按钮搜索
    searchBtn() {
        let value = this.data.inputValue.replace(/\s/gi, '')
        if (value == '') {
            wx.showToast({
                title: '请输入查询信息',
                image: '/image/center.png'
            })
        } else {
            if (this.data.searchType == 1) {
                wx.redirectTo({
                    url: '/pages/index/result?type=1&keyword=' + value + '',
                })
            } else {
                wx.redirectTo({
                    url: '/pages/index/result?type=2&keyword=' + value + '',
                })
            }
        }
    },
    // 点击热门搜索搜索
    searchGoods(e) {
        let value = e.target.dataset.title
        if (this.data.searchType == 1) {
            wx.redirectTo({
                url: '/pages/index/result?type=1&keyword=' + value + '',
            })
        } else {
            wx.redirectTo({
                url: '/pages/index/result?type=2&keyword=' + value + '',
            })
        }

    },
    // 切换抢券或商家
    typeChange(e) {
        this.setData({
            type: e.detail.value,
            searchType: e.detail.value + 1,
        })
        this.getSearchInfo()

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        that.getSearchInfo()
    },

    // 获取热门搜索信息
    getSearchInfo: function () {
        let that = this
        wx.request({
            url: app.globalData.baseUrlV3 + 'Wxchat/hot_search',
            method: 'post',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                type: that.data.searchType
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        searchInfo: res.data.data
                    })
                }
            }
        })
    }
})
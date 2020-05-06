# WxApp-qrcodeComponent
一个支持根据传入的背景url，二维码内容，头像url进行自适应生成海报的微信小程序组件
/* 一个可以根据当前设备屏幕宽高进行自适应生成海报的弹窗组件, 传入对应的头像url，二维码内容，背景图url即可
* 由于通过wea_qrcode 生成的data数据在小程序开发模拟器上可以正常绘制但是在真机上绘制不了，所以我用base64对已经转换的data数据进行了一个本地转换
* 生成了一个本地的base64图片来保证绘制
* 使用方法如下
* <poster-popup configInfo="{{configInfo}}"/>
* eg: config = {
       posterInfo: {
         width: 969,  // 设计稿的宽高
         height: 1552,
         img: posterImg
       },
       avatarInfo: {
         img: avatarUrl || defaultAvatarImg,
         y: 28, // 头像在设计稿中的位置
         r: 18
       },
       qrcodeInfo: {
         x: 650,  // 二维码在设计稿中的位置
         y: 1320,
         l: 200,
         dataUrl: '' // 二维码的数据比如一个连接 www.test.com
       },
       windowInfo: this.properties.windowInfo //  通过wx.getSystemInfo API 拿到的设备信息 , 可以在attached钩子函数中用一个promise来拿到
     }
//  拿到SystemInfo
       const _this = this //  保留外部this指针
       let setInfo = new Promise(function (resolve) {
         wx.getSystemInfo({
           success: function (res) {
             _this.setData({
               windowInfo: {
                 winWidth: res.windowWidth,
                 winHeight: res.windowHeight,
                 pixelRatio: res.pixelRatio
               }
             })
             resolve()
           },
           fail: function (err) {
             console.error(err)
             resolve()
           }
         })
       })
*/

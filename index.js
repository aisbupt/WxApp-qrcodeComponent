import connect from '../../../../libs/redux-wxapp';
import QR from './utils/qrcode';
import base64 from './utils/base64src';

const component = connect.Component(
    getApp().store
)({
  externalClasses: ['my-class'],
  properties: {
    configInfo: {
      type: Object,
      value: null
    }
  },
  data: {
    imgSrc: null,
    imgLoaded: false,
    pending: false,
    poster: '',
    bgImgUrl: '',
    AvatarUrl: '',
    qrCode: '',
    canvasH: 1552,
    canvasW: 969
  },
  attached(){
    let that=this;
    const scale = 1552 / 969 // 设计稿高宽比
    const winWidth = this.properties.configInfo.windowInfo.winWidth * 0.8
    const winHeight = winWidth * scale
    this.setData({canvasH: winHeight, canvasW: winWidth})
    const configInfo = that.properties.configInfo
    this.setData({
      canvasWidth: configInfo.windowInfo.winWidth,
      canvasHeight: configInfo.windowInfo.winHeight
    })
    let QrCode = this.getQrCode(configInfo.qrcodeInfo.dataUrl, function(res) {
      let _this = this
      base64.base64src(res, res => {
        // console.log(res) // 返回图片地址
        _this.setData({
          qrCode: res
        })
      });

    })
    let bg = this.downLoadImg(configInfo.posterInfo.img, function(res){
      this.setData({bgImgUrl: res})
    })
    let avatar = this.downLoadImg(configInfo.avatarInfo.img, function(res){
      this.setData({AvatarUrl: res})
    })
    wx.showLoading({title: '正在生成海报中'})
    Promise.all([QrCode, bg, avatar]).then(_ =>{
      this.drawImage({width: winWidth, height: winHeight})
    })
  },
  methods: {
    getQrCode(dataUrl, callback) {
      const _this = this
      return new Promise(function (resolve) {
        let imgData = QR.drawImg(dataUrl, {
          typeNumber: 4,
          errorCorrectLevel: 'M',
          size: 500
        })
        callback.call(_this, imgData)
        resolve(imgData)
      })
    },
    downLoadImg(src, callback) {
      const _this = this
      return new Promise(function (resolve) {
        wx.getImageInfo({
          src: src,
          success: function (res) {
            callback.call(_this, res.path)
            resolve(res.path)
          }
        })
      })
    },
    drawImage(canvasAttrs) {
      let ctx = wx.createCanvasContext('canvasPoster', this)
      //const pixeRatio = this.properties.configInfo.windowInfo.pixelRatio
      const scaleW = canvasAttrs.width / 414
      const scaleH = canvasAttrs.height / 672

      let canvasW = canvasAttrs.width// 画布的真实宽度
      let canvasH = canvasAttrs.height//画布的真实高度

      //console.log(canvasW,canvasH)
      let headerW = 50 * scaleW
      let headerX = 20 * scaleW
      let headerY = 15 * scaleH
      let qrcodeW = 90 * scaleH
      let qrcodeX = 275 * scaleW
      let qrcodeY = 565 * scaleH
      //填充背景
      ctx.drawImage(this.data.bgImgUrl, 0, 0, canvasW, canvasH)
      ctx.save()
      // 控制头像为圆形
      ctx.setStrokeStyle('rgba(0,0,0,.2)') //设置线条颜色，如果不设置默认是黑色，头像四周会出现黑边框
      ctx.arc(headerX + headerW / 2, headerY + headerW / 2, headerW / 2, 0, 2 * Math.PI)
      ctx.stroke()
      //画完之后执行clip()方法，否则不会出现圆形效果
      ctx.clip()
      // 将头像画到画布上
      //console.log(this.data.AvatarUrl)
      ctx.drawImage(this.data.AvatarUrl, headerX, headerY, headerW, headerW)
      ctx.restore()
      ctx.save()
      // 绘制二维码
      var _this = this

      ctx.drawImage(this.data.qrCode, qrcodeX, qrcodeY, qrcodeW, qrcodeW)
      ctx.save()
      ctx.draw(false, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: canvasW,
            height: canvasH,
            destWidth: canvasW * 2,//生成图片的大小设置成canvas大小的二倍解决模糊
            destHeight: canvasH * 2,
            canvasId: 'canvasPoster',
            success: (res) => {
              _this.setData({poster: res.tempFilePath})
              wx.hideLoading()
            },
            fail: function (errs) {
              console.error('生成图片出错:', JSON.stringify(errs))
              wx.hideLoading()
              wx.showModal({
                title: '生成海报失败',
                content: '请稍后重试',
                showCancel: false
              })
            }
          }, _this)
        }, 200)
      })
    },

    eventClose() {
      if (!this.pending) {
        this.triggerEvent('closeposter');
      }
    },

    shareFrog() {
      this.triggerEvent('shareFrog');
    },
    // 长按保存
    eventLongPress(e) {
      let url = e.currentTarget.dataset.url;
      //wx.previewImage({urls:[url]})
      const _this = this
      wx.saveImageToPhotosAlbum({
        filePath:url,
        success(res) {
          wx.showToast({
            title: '图片保存成功',
            icon: 'none',
            duration: 1000,
          });
          _this.shareFrog()
        },
        fail(res){
          wx.showToast({
            title: '图片保存失败',
            icon: 'none',
            duration: 1000,
          });
        }
      })
    },
  }
});

Component(component);

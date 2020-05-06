/*
* 由于直接用wea_qrcode 插件生成的二维码data在真机上绘制不了
* 所以需要利用这个库转换为base64图片保存在微信小程序本地环境中
* */
const fsm = wx.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src'; //自定义文件名

var base64src = function (base64data, cb) {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
        return (new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
    const buffer = wx.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
        filePath,
        data: buffer,
        encoding: 'binary',
        success() {
            cb(filePath);
        },
        fail() {
            return (new Error('ERROR_BASE64SRC_WRITE'));
        },
    });
};
module.exports = {
    base64src: base64src
};

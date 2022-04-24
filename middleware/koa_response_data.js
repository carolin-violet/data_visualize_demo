// 处理业务逻辑的中间件,读取data数据返回给前端

const path = require('path')
const fileUtils = require('../utils/file_utils')


module.exports = async(ctx, next) => {
    const url = ctx.request.url
    let filePath = '../data' + url.replace('/api', '') + '.json'
    filePath = path.join(__dirname, filePath)

    try {
        const res = await fileUtils.getFileJsonData(filePath)
        ctx.response.body = res
    } catch {
        const errorMsg = {
            message: '读取失败,文件内容不存在',
            status: 404
        }
        ctx.response.body = JSON.stringify(errorMsg)
    }

    await next()
}
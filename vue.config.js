// const BASE_URL = process.env.NODE_ENV === 'productiojn' ? '/dian_xin' : '/'

module.exports = {
  devServer: {
    proxy: {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
}

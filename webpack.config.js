const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    hot: true,
  },
  plugins: [isDevelopment && new webpack.HotModuleReplacementPlugin()].filter(
    Boolean
  ),
};

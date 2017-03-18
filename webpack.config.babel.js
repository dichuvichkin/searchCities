import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import { WDS_PORT } from './src/shared/config';
import { isProd } from './src/shared/util';

export default {
  entry: ['./src/client/index.js'],
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: isProd ? '/static/' : `http://localhost:${WDS_PORT}/dist/`,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader'],
          publicPath: isProd ? '/static/' : `http://localhost:${WDS_PORT}/dist/`,
        }),
      },
    ],
  },
  plugins: [new ExtractTextPlugin('css/style.css')],
  devtool: isProd ? false : 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    port: WDS_PORT,
  },
};

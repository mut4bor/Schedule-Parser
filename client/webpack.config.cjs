const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const dotenv = require('dotenv').config({ path: __dirname + '/.env' })
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  devServer: {
    hot: true,
    liveReload: true,
    historyApiFallback: true,
    open: true,
    port: '3000',
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
  devtool: 'inline-source-map',
  target: ['web'],
  mode: 'development',
  module: {
    rules: [
      // https://github.com/webpack-contrib/sass-loader/issues/867#issuecomment-1196874599
      {
        oneOf: [
          {
            test: /\.(ts|tsx)$/,
            include: fs.realpathSync(process.cwd()),
            loader: 'ts-loader',
          },
          {
            test: /\.(js|mjs)$/,
            loader: require.resolve('babel-loader'),
          },
          {
            test: /\.scss$/,

            oneOf: [
              {
                test: /\.module\.scss$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                  {
                    loader: 'style-loader', // https://www.npmjs.com/package/style-loader and https://github.com/webpack-contrib/style-loader?tab=readme-ov-file#recommend
                    options: {
                      esModule: true,
                    },
                  },
                  {
                    loader: 'css-loader',
                    options: {
                      sourceMap: true,
                      importLoaders: 2,
                      modules: {
                        exportLocalsConvention: 'asIs',
                        namedExport: true,
                        auto: (resourcePath, resourceQuery, resourceFragment) => {
                          return resourcePath.endsWith('module.scss')
                        },
                      },
                    },
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: true,
                    },
                  },
                ],
              },
              {
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      sourceMap: true,
                    },
                  },
                  {
                    loader: 'sass-loader',
                    options: {
                      sourceMap: true,
                    },
                  },
                ],
              },
            ],
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
          {
            test: /\.(svg|ico|gif|png|jpg|jpeg)$/,
            use: ['file-loader'],
          },
        ],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      publicPath: '/',
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'public/favicon.png', to: 'favicon.png' }],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
      'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production'),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
}

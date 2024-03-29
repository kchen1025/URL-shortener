const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './index.tsx',
  output: {
    filename: 'bundle.js',
    // path: __dirname + "/../public/dist",
    path: path.join(__dirname, '../public', 'dist')
  },
  plugins: [
    new Dotenv({
      path: './.env.local'
    })
  ],

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json', '.styl'],
    modules: ['node_modules']
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.json'
        }
      },
      {
        test: /\.styl$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { modules: true } },
          {
            loader: 'stylus-loader'
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   react: "React",
  //   "react-dom": "ReactDOM",
  // },
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, '/../public'),
    historyApiFallback: true,
    publicPath: '/dist/',
    proxy: {
      '/api': 'http://localhost:3000',
      '/in': 'http://localhost:3000'
    }
  }
};

module.exports = {
  entry: "./app/main.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'},
      {test: /\.css/, loader: 'style-loader!css-loader'},
      {test: /\.scss$/, loader: "style!css!sass"}
    ]
  }
};

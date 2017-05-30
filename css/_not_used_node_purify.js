var purify = require('purify-css');

var content = ['**/static/*.html','**/static/admin/*.html','**/static/*.js'];
var css = ['**/static/css/big.css'];

var options = {
  minify: true,
  output: './purified.css'
};

purify(content, css, options);

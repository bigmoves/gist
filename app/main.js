require('./styles/bootstrap.scss');
require('./styles/styles.css');

var React = require('react');
var routes = require('./config/routes');
React.renderComponent(routes, document.body);

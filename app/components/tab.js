/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Tab = module.exports = React.createClass({

  mixins: [ Router.ActiveState ],

  getInitialState: function () {
    return { isActive: false };
  },

  updateActiveState: function () {
    this.setState({
      isActive: Tab.isActive(this.props.to, this.props.params, this.props.query)
    })
  },

  render: function() {
    var className = this.state.isActive ? 'active' : '';
    var link = Link(this.props);
    return <li className={className}>{link}</li>;
  }
});

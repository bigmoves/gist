/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var Link = require('react-router').Link;
var $ = require('jquery');
var hljs = require('highlight.js/lib');
var Tab = require('./tab');
var Panel = require('./panel');

// hljs theme
require('../styles/ascetic.css');

var Show = module.exports = React.createClass({
  getInitialState: function() {
    return {
      gist: {}
    }
  },

  componentDidMount: function() {
    if (this.props.params.ref)
      this.fetchRef();
    else
      this.fetchGist();
  },

  fetchGist: function() {
    var self = this;
    $.ajax('/api/gists/' + this.props.params.gistKey)
    .done(function(gist) {
      self.setState({ gist: gist });
    });
  },

  fetchRef: function() {
    var self = this;
    $.ajax('/api/gists/' + this.props.params.gistKey + '/' + this.props.params.ref)
    .done(function(gist) {
      self.setState({ gist: gist });
    });
  },

  handleDelete: function() {
    $.ajax({
      url: '/api/gists/' + this.props.params.gistKey,
      type: 'DELETE'
    })
    .done(function() {
      Router.transitionTo('index');
    });
  },

  render: function() {
    var gistKey = this.props.params.gistKey;
    return (
      <div>
        <header className="show clearfix">
          <span className="description">{this.state.gist.description || ''}</span>
          <div className="actions pull-right">
            <Link to="edit" gistKey={gistKey} className="btn btn-default btn-sm">Edit</Link>
            <button className="btn btn-default btn-sm" onClick={this.handleDelete}>Delete</button>
          </div>
        </header>
        <ul className="nav nav-tabs" role="tablist">
          <Tab to="show" gistKey={gistKey}>Code</Tab>
          <Tab to="revisions" gistKey={gistKey}>Revisions</Tab>
        </ul><br/>
        {this.props.activeRouteHandler() || <Code gist={this.state.gist}/> }
      </div>
    );
  }
});

var Code = React.createClass({
  componentDidMount: function() {
    this.highlightCode();
  },

  componentDidUpdate: function() {
    this.highlightCode();
  },

  highlightCode: function() {
    $(this.refs.code.getDOMNode()).each(function(i, block) {
      hljs.highlightBlock(block);
    });
  },

  render: function() {
    return (
      <Panel heading={this.props.gist.filename}>
        <pre><code ref="code">{this.props.gist.body}</code></pre>
      </Panel>
    );
  }
});

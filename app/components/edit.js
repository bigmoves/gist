/** @jsx React.DOM */

var React = require('react/addons');
var Router = require('react-router');
var Link = require('react-router').Link;
var CodeMirror = require('code-mirror');
var $ = require('jquery');

require('../styles/codemirror.css');

var Edit = module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function() {
    return {
      description: '',
      filename: ''
    }
  },

  componentDidMount: function() {
    this.editor = CodeMirror.fromTextArea(this.refs.code.getDOMNode(), {
      lineNumbers: true
    });

    var self = this;
    $.ajax('/api/gists/' + this.props.params.gistKey)
    .done(function(gist) {
      self.setState({
        description: gist.description,
        filename: gist.filename
      });
      self.editor.setValue(gist.body);
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var gist = {
      description: this.state.description,
      filename: this.state.filename,
      body: this.editor.getValue()
    };

    $.ajax({
      url: '/api/gists/' + this.props.params.gistKey,
      type: 'PUT',
      data: gist
    })
    .done(function(data) {
      Router.transitionTo('show', {gistKey: data.key});
    });
  },

  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          ref="description"
          className="form-control"
          placeholder="enter a description"
          valueLink={this.linkState("description")}/><br/>
        <div className="panel panel-default">
          <div className="panel-heading clearfix">
            <div className="col-xs-3">
              <input
                type="text"
                ref="filename"
                className="form-control input-sm pull-left"
                placeholder="enter a filename"
                valueLink={this.linkState("filename")} />
            </div>
          </div>
          <div className="panel-body">
            <textarea ref="code" valueLink={this.linkState("body")}/>
          </div>
        </div>
        <div className="actions pull-right">
          <Link to="show" gistKey={this.props.params.gistKey} className="btn btn-default">Cancel</Link>
          <button type="submit" className="btn btn-success">Update Gist</button>
        </div>
      </form>
    );
  }
});

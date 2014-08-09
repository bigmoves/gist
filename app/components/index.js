/** @jsx React.DOM */

var React = require('react');
var Router = require('react-router');
var CodeMirror = require('code-mirror');
var $ = require('jquery');

require('../styles/codemirror.css');

var Index = module.exports = React.createClass({
  getInitialState: function() {
    return {
      description: '',
      filename: '',
      body: ''
    }
  },

  componentDidMount: function() {
    this.editor = CodeMirror.fromTextArea(this.refs.code.getDOMNode(), {
      lineNumbers: true
    });
    this.editor.focus();
    this.editor.on('change', this.handleEditorInput);
  },

  handleEditorInput: function() {
    this.setState({ body: this.editor.getValue() });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var gist = {
      description: this.refs.description.getDOMNode().value,
      filename: this.refs.filename.getDOMNode().value,
      body: this.editor.getValue()
    };

    $.ajax({
      url: '/api/gists',
      type: 'POST',
      data: gist
    })
    .done(function(data) {
      Router.transitionTo('show', { gistKey: data.key });
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
          defaultValue={this.state.description}/><br/>
        <div className="panel panel-default">
          <div className="panel-heading clearfix">
            <div className="col-xs-3">
              <input
                type="text"
                ref="filename"
                className="form-control input-sm pull-left"
                placeholder="enter a filename"
                defaultValue={this.state.filename} />
            </div>
          </div>
          <div className="panel-body">
            <textarea ref="code" defaultValue={this.state.body}/>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-default pull-right"
          disabled={this.state.body ? '' : 'disabled'}>Create Gist
        </button>
      </form>
    );
  }
});

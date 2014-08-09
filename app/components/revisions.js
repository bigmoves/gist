/** @jsx React.DOM */

var React = require('react');
var Link = require('react-router').Link;
var $ = require('jquery');
var moment = require('moment');

var Revisions = module.exports = React.createClass({
  getInitialState: function() {
    return {
      revisions: []
    };
  },

  componentDidMount: function() {
    var self = this;
    $.ajax('/api/gists/' + this.props.params.gistKey + '/revisions')
    .done(function(revisions) {
      console.log(revisions);
      self.setState({ revisions: revisions });
    });
  },

  renderListItem: function(revision) {
    return (
      <li className="list-group-item">
        Revised {moment(revision.timestamp).fromNow()}.
        <Link to="ref" gistKey={this.props.params.gistKey} ref={revision.value.ref} className="btn btn-default btn-xs pull-right">
          View gist @ {revision.path.ref.substr(0,7)}
        </Link>
      </li>
    );
  },

  render: function() {
    return (
      <div>
        <ul className="list-group">
          {this.state.revisions.map(this.renderListItem)}
        </ul>
      </div>
    );
  }
});

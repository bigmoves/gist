/** @jsx React.DOM */
var Routes = require('react-router').Routes;
var Route = require('react-router').Route;

module.exports = (
  <Routes>
    <Route location="history" handler={require('../components/app')}>
      <Route name="index" path="/" handler={require('../components/index')} />
      <Route name="show" path="/gists/:gistKey" handler={require('../components/show')}>
        <Route name="revisions" path="/gists/:gistKey/revisions" handler={require('../components/revisions')} />
      </Route>
      <Route name="edit" path="/gists/:gistKey/edit" handler={require('../components/edit')} />
      <Route name="ref" path="/gists/:gistKey/:ref" handler={require('../components/show')}/>
    </Route>
  </Routes>
);

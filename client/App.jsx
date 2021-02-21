import React from 'react'
import Collection from './modules/Collection.jsx';
import Suggestions from './modules/Suggestions.jsx';
import Preferences from './modules/Preferences.jsx';
import Login from './modules/Login.jsx';
import Signup from './modules/Signup.jsx';
import axios from 'axios';
import render from './utils/render.js'
import auth from './utils/auth.js';
import collection from './utils/collection.js';
import suggestions from './utils/suggestions.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: false,
      suggestions: false,
      preferences: false,
      ownedGames: [],
      loggedIn: false,
      signup: true,
      user: null
    }
    this.openShelf = this.openShelf.bind(this);
    this.renderCollection = this.renderCollection.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.renderPreferences = this.renderPreferences.bind(this);
    this.handleAddGame = this.handleAddGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemoveGame = this.handleRemoveGame.bind(this);
  }

  openShelf(e) {
    let shelf = document.getElementById('shelf');
    if (shelf.style.display === "none") {
      shelf.style.display = "block";
      let collection = document.getElementById('collection');
      collection.style.display = "none"
      let suggestions = document.getElementById('suggestions');
      suggestions.style.display = "none"
      let preferences = document.getElementById('preferences');
      preferences.style.display = "none"
    } else {
      shelf.style.display = "none";
    }
  }

  handleChange(e) {
    console.log(e.target.value);
    this.setState({name: e.target.value})
  }

  handleAddGame(game) {
    collection.addGame.call(this, game);
  }

  handleRemoveGame(game) {
    var games = [];
    for (var i = 0; i < this.state.ownedGames.length; i++) {
      if (this.state.ownedGames[i].id !== game) {
        games.push(this.state.ownedGames[i]);
      }
    }
    this.setState({ownedGames: games});
  }

  renderCollection(e) {
    this.openShelf();
    let collection = document.getElementById('collection');
      collection.style.display = "block"
  }

  renderSuggestions(e) {
    this.openShelf();
    let suggestions = document.getElementById('suggestions');
    suggestions.style.display = "block"
  }

  renderPreferences(e) {
    this.openShelf();
    let preferences = document.getElementById('preferences');
    preferences.style.display = "block"
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/getUserCollection')
    .then(result => {
      console.log(result.data.records)
      let records = result.data.records;
      let games = []
      for (var i = 0; i < records.length; i++) {
        games.push(records[i]._fields[0].properties);
      }
      this.setState({ownedGames: games})
      // Each record is stored at result.data.records[i]._fields[0].properties
    });
  }

  render() {

    let login = <Login />
    if (this.state.loggedIn) {
      login = <div></div>
    } else if (this.state.signup) {
      login = <Signup />
    }

    return (
      <div>
        <div id="topbar">
          <span className="site_title" onClick={this.openShelf}>Game On!</span>
          {login}
        </div>
        <div id="shelf">
          <h4
          onClick={this.renderCollection}>My Collection</h4>
          <h4 onClick={this.renderSuggestions}>Suggestions</h4>
          <h4 onClick={this.renderPreferences}>Preferences</h4>
        </div>

          <Collection
          games={this.state.ownedGames}
          open={this.state.collection}
          addGame={this.handleAddGame}
          changeSearch={this.handleChange}
          removeGame={this.handleRemoveGame}/>

          <Suggestions
          open={this.state.suggestions}/>

          <Preferences
          open={this.state.preferences}/>
      </div>
    )
  }
}



export default App;
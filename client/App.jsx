/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prefer-const */
import React from 'react';
import axios from 'axios';
import Collection from './modules/Collection';
import Suggestions from './modules/Suggestions';
import Preferences from './modules/Preferences';
import Login from './modules/Login';
import Signup from './modules/Signup';
import {
  openShelf, renderCollection, renderSuggestions, renderPreferences,
} from './utils/render';
import { signupUser, loginUser } from './utils/auth';
import { addGame, removeGame } from './utils/collection';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collection: false,
      suggestions: false,
      preferences: false,
      ownedGames: [],
      suggestedGames: [],
      loggedIn: false,
      signup: false,
      // eslint-disable-next-line react/no-unused-state
      user: null,
    };

    this.openShelf = openShelf.bind(this);
    this.renderCollection = renderCollection.bind(this);
    this.renderSuggestions = renderSuggestions.bind(this);
    this.renderPreferences = renderPreferences.bind(this);
    this.handleAddGame = this.handleAddGame.bind(this);
    this.handleRemoveGame = this.handleRemoveGame.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.updateGameStateBasedOnUser = this.updateGameStateBasedOnUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updateSuggestionsStateBasedOnUser = this.updateSuggestionsStateBasedOnUser.bind(this);
    // this.goToLogin = this.goToLogin.bind(this);
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/getUserCollection')
      .then((result) => {
        console.log(result.data.records);
        let { records } = result.data;
        let games = [];
        for (let i = 0; i < records.length; i += 1) {
          // eslint-disable-next-line no-underscore-dangle
          games.push(records[i]._fields[0].properties);
        }
        this.setState({ ownedGames: games });
      // Each record is stored at result.data.records[i]._fields[0].properties
      });
  }

  handleAddGame(game) {
    addGame.call(this, game);
  }

  handleRemoveGame(game) {
    removeGame.call(this, game);
  }

  goToSignUp() {
    this.setState({ signup: true });
  }

  goToLogin() {
    this.setState({ signup: false });
  }

  updateGameStateBasedOnUser(gameInfo) {
    this.setState({ ownedGames: gameInfo });
  }

  updateSuggestionsStateBasedOnUser(suggestions) {
    this.setState({ suggestedGames: suggestions });
  }

  updateUser(name) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ user: name });
  }

  render() {
    let login = (
      <Login
        login={loginUser}
        signup={this.goToSignUp}
        updateGames={this.updateGameStateBasedOnUser}
        updateSuggestions={this.updateSuggestionsStateBasedOnUser}
        updateUser={this.updateUser}
      />
    );
    let {
      loggedIn, signup, ownedGames, collection, suggestions, suggestedGames, preferences,
    } = this.state;
    if (loggedIn) {
      login = <div />;
    } else if (signup) {
      login = <Signup signup={signupUser} login={this.goToLogin} />;
    }

    return (
      <div>
        <div id="topbar">
          <span className="site_title" role="button" onClick={this.openShelf}>Game On!</span>
          {login}
        </div>
        <div id="shelf">
          <h4
            onClick={this.renderCollection}
          >
            My Collection
          </h4>
          <h4 onClick={this.renderSuggestions}>Suggestions</h4>
          <h4 onClick={this.renderPreferences}>Preferences</h4>
        </div>

        <Collection
          games={ownedGames}
          open={collection}
          addGame={this.handleAddGame}
          removeGame={this.handleRemoveGame}
        />

        <Suggestions
          open={suggestions}
          games={suggestedGames}
        />

        <Preferences
          open={preferences}
        />
      </div>
    );
  }
}

export default App;

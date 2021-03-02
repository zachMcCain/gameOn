/* eslint-disable react/prop-types */
/* eslint-disable prefer-const */
import React from 'react';
import GameCard from './gameDisplay/GameCard';
import GameDetail from './gameDisplay/GameDetail';

const GameDisplay = ({
  games, handleDisplay,
  displayIndividual, handleSelection,
  selectedGame, addGameToCollection,
  removeGameFromCollection,
}) => {
  let gameCards = <div />;
  if (games.length) {
    gameCards = games.map((game) => (
      <GameCard game={game} handleDisplay={handleDisplay} handleSelection={handleSelection} />
    ));
  }

  if (displayIndividual) {
    return (
      <GameDetail
        game={selectedGame}
        addGameToCollection={addGameToCollection}
        removeGameFromCollection={removeGameFromCollection}
      />
    );
  }
  return (
    <div id="gameDisplayArea">
      {gameCards}
    </div>
  );
};

export default GameDisplay;

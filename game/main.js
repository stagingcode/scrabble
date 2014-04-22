/**
 * Game constructor
 * @param canvas
 * @constructor
*/
function Scrabble(canvas) {
  this.canvas = canvas;

  // game char pool, still missing empty ones
  this.charPool = 'aaaaaaaaabbccddddeeeeeeeeeeeeffggghhiiiiiiiiijkllllmmnnnnnnooooooooppqrrrrrrssssttttttuuuuvvwwxyyz'.split('');

  this.board = new Board(this);
  this.board.draw();

  this.assingHandlers();
}


/**
 * Assigns handlers to the canvas
 */
Scrabble.prototype.assingHandlers = function() {
  var game = this;
  var tool = new paper.Tool();

  var selecting = false;

  tool.onMouseDown = function(event) {
    if(event.item) {
      game.board.selectTile(event.item);
      selecting = true;
    }
  };

  tool.onMouseMove = function(event) {
    if(selecting && event.item && game.board.selectedTiles.indexOf(event.item)) {
      game.board.selectTile(event.item);
    }
  };

  tool.onMouseUp = function(event) {
    game.board.unselectTiles();
    selecting = false;
  };
};



document.addEventListener('DOMContentLoaded', function(){
  /* get canvas */
  var canvas = document.getElementById('scrabble');

  /* initialize paper */
  paper.setup(canvas);

  /* initialize Scrabble */
  var game = new Scrabble(canvas);

  /* draw canvas */
  paper.view.draw();
});
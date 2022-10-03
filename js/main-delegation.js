import { CELL_VALUE, GAME_STATUS, TURN } from './constants.js';
import {
  getCellElementAtIdx,
  getCellElementList,
  getCellListElement,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from './selectors.js';
import { checkGameStatus } from './utils.js';

// console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X']));
// console.log(checkGameStatus(['X', 'O', 'X', 'X', '0', 'X', 'O', 'X', '0']));
// console.log(checkGameStatus(['X', '', 'X', 'X', 'O', 'X', 'O', 'X', 'O']));
/**
 * Global variables
 */
let currentTurn = TURN.CROSS; // lượt hiện tại
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill('');

// chuyển đổi lượt
function toggleTurn() {
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  // update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.add('show');
}

function hideReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.add('remove');
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error('Invalid win positions');
  }

  for (const positions of winPositions) {
    const cell = getCellElementAtIdx(positions);
    if (cell) cell.classList.add('win');
  }
}

// cell - tag li , index - vị trí
// xử lý nhấp chuột vào ô
function handleCellClick(cell, index) {
  const isClicked =
    cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS);
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;

  // only allow to click if game is playing and that cell is not click
  if (isClicked || isEndGame) return;

  // set selected cell - đặt ô đã chọn
  cell.classList.add(currentTurn);

  // update cellValues - cập nhật giá trị ô
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  // toggle turn - chuyển đổi lần lượt
  toggleTurn();

  // check game status
  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }

    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      updateGameStatus(game.status);
      showReplayButton();
      highlightWinCells(game.winPositions);
      break;
    }

    default:
    // playing
  }

  // console.log('click', cell, index);
}

//init Danh sách phần tử ô
function initCellElementList() {
  // set index for each li element
  const liList = getCellElementList();
  liList.forEach((cell, index) => {
    cell.dataset.idx = index;
  });

  // attach event click for ul element
  const ulElement = getCellListElement();
  if (ulElement) {
    ulElement.addEventListener('click', (event) => {
      if (event.target.tagName !== 'LI') return;

      const index = Number.parseInt(event.target.dataset.idx);
      handleCellClick(event.target, index);
    });
  }
}

function resetgame() {
  // reset temp global vars
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => '');

  // reset DOM elements
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);

  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(TURN.CROSS);
  }

  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = '';
  }

  // hide replay button
  hideReplayButton();
}

function initReplayButton() {
  const replayButon = getReplayButtonElement();
  if (replayButon) {
    replayButon.addEventListener('click', resetgame);
  }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
(() => {
  // bind click event for all li elements - liên kết sự kiện nhấp chuột cho tất cả các phần tử li
  initCellElementList();

  // bind click event for replay button - liên kết sự kiện nhấp chuột cho nút phát lại
  initReplayButton();
})();

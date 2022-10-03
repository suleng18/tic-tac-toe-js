// Implement selector function to get elements needed
// 1. Cell List
// 2. Current Turn
// 3. Replay Game
// 4. Game status
export function getCellElementList() {
  //nhận danh sách phần tử ô
  return document.querySelectorAll('#cellList > li');
}

export function getCurrentTurnElement() {
  //nhận phần tử rẽ hiện tại
  return document.getElementById('currentTurn'); //lượt hiện tại
}

export function getCellElementAtIdx(index) {
  return document.querySelector(`#cellList > li:nth-child(${index + 1})`);
}

export function getGameStatusElement() {
  return document.getElementById('gameStatus');
}

export function getReplayButtonElement() {
  return document.getElementById('replayGame');
}

export function getCellListElement() {
  return document.getElementById('cellList');
}

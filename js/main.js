const NUMBER_OF_BOXES = 10;
const sources = ['img/00.webp', 'img/01.webp', 'img/02.webp', 'img/03.webp', 'img/04.webp'];
const speed = 1000;
const newGameSpeed = 5000;

function shuffleArray(arr0) {
  const arr = [...arr0];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const getFalseArray = (N) => Array(N).fill(false);

const getBoxArray = (N) => getFalseArray(N).map((_, i) => i % (N / 2));

const getNewGame = () => ({
  clickActive: true,
  startTime: null,
  table: shuffleArray(getBoxArray(NUMBER_OF_BOXES)),
  found: getFalseArray(NUMBER_OF_BOXES),
  flipped: null,
  elements: [],
  runTime: false,
});

let state = {};

const createBox = (src) => `<div class="box" >
<div class="inner">
  <div class="back_side"><img src="img/bg.webp" alt="background"></div>
  <div class="img_side"><img src="${src}" alt="cat"></div>
</div>
</div>`;

const createBoard = () => {
  const targetDiv = document.querySelector('.holder');
  targetDiv.innerHTML = state.table.map((image) => createBox(sources[image])).join('\n');
  state.elements = document.querySelectorAll('.box');
};

const timeDiv = document.querySelector('.clock');

const secondsToMMSS = (seconds) => new Date(seconds * 1000).toISOString().substring(14, 19);

const handleClock = () => {
  if (state.startTime === null) {
    return;
  }
  const delta = (Date.now() - state.startTime) / 1000;
  timeDiv.innerHTML = secondsToMMSS(delta);
  if (state.runTime) {
    setTimeout(handleClock, 200);
  }
};

const handleClockStart = () => {
  if (state.startTime === null) {
    state.startTime = Date.now();
    state.runTime = true;
    handleClock();
  }
};

const isAllFound = () => state.found.indexOf(false) === -1;

const flipOverOrBack = (index, over = true) => {
  if (index === null) {
    return;
  }
  const element = state.elements[index];
  if (over) {
    element.children[0].classList.add('flipped');
  } else {
    element.children[0].classList.remove('flipped');
  }
};

const handleNewGame = () => {
  if (isAllFound()) {
    state.clickActive = false;
    state.runTime = false;
    // eslint-disable-next-line no-use-before-define
    setTimeout(startNewGame, newGameSpeed);
  }
};

const handleStep = (index) => {
  if (state.found[index] || !state.clickActive || index === state.flipped) {
    return; // already found, click disabled, or picture already selected
  }
  flipOverOrBack(index, true);
  if (state.flipped === null) { // 1st flip
    state.flipped = index;
  } else if (state.table[index] === state.table[state.flipped]) { // 2nd flip, match
    state.found[index] = true;
    state.found[state.flipped] = true;
    state.flipped = null;
  } else { // 2nd flip, no match
    state.clickActive = false;
    setTimeout(() => {
      flipOverOrBack(index, false);
      flipOverOrBack(state.flipped, false);
      state.flipped = null;
      state.clickActive = true;
    }, speed);
  }
  handleNewGame();
};

const clicked = (element, index) => {
  handleClockStart();
  handleStep(index);
};

const addListeners = () => {
  state.elements.forEach((element, index) => {
    element.addEventListener('click', () => {
      clicked(element, index);
    });
  });
};

function startNewGame() {
  state = getNewGame();
  createBoard();
  addListeners();
}

startNewGame();

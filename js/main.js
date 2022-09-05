const NUMBER_OF_BOXES = 10;
const sources = ['img/00.webp', 'img/01.webp', 'img/02.webp', 'img/03.webp', 'img/04.webp'];

function shuffleArray(arr0) {
  const arr = [...arr0];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const getBoxArray = (N) => Array(N).fill(0).map((_, i) => i % (N / 2));

const getNewGame = () => ({
  startTime: null,
  table: shuffleArray(getBoxArray(NUMBER_OF_BOXES)),

});

let state = getNewGame();

const createBox = (src) => `<div class="box" >
<div class="inner">
  <div class="back_side"><img src="img/bg.webp" alt="background"></div>
  <div class="img_side"><img src="${src}" alt="cat"></div>
</div>
</div>`;

const createBoard = () => {
  const targetDiv = document.querySelector('.holder');
  targetDiv.innerHTML = state.table.map((image) => createBox(sources[image])).join('\n');
};

const handleClock = () => {
  if (state.startTime === null) {
    state.startTime = Date.now();
  }
};

const clicked = (element, index) => {
  handleClock();
  element.children[0].classList.add('flipped');
  // .children[0].classList.remove('flipped')
};

const addListeners = () => {
  document.querySelectorAll('.box').forEach((element, index) => {
    element.addEventListener('click', () => {
      clicked(element, index);
    });
  });
};

state = getNewGame();
createBoard();
addListeners();

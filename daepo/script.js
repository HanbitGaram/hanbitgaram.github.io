const setupModal = document.querySelector("#setup-modal");
const gameOverModal = document.querySelector("#game-over-modal");
const setupForm = document.querySelector("#setup-form");
const maxNumberInput = document.querySelector("#max-number");
const setupError = document.querySelector("#setup-error");
const drawButton = document.querySelector("#draw-button");
const resetButton = document.querySelector("#reset-button");
const restartButton = document.querySelector("#restart-button");
const guideText = document.querySelector("#guide-text");
const balloon = document.querySelector("#balloon");
const balloonNumber = document.querySelector("#balloon-number");
const balloonOrder = document.querySelector("#balloon-order");
const historyList = document.querySelector("#history-list");
const drawCount = document.querySelector("#draw-count");
const maxCount = document.querySelector("#max-count");
const gameOverText = document.querySelector("#game-over-text");

const state = {
  maxNumber: 0,
  remainingNumbers: [],
  drawnNumbers: [],
};

function buildNumberPool(maxNumber) {
  return Array.from({ length: maxNumber }, (_, index) => index + 1);
}

function updateHistory() {
  historyList.replaceChildren();

  state.drawnNumbers.forEach((number) => {
    const item = document.createElement("span");
    item.className = "history-item";
    item.textContent = String(number);
    historyList.append(item);
  });

  drawCount.textContent = String(state.drawnNumbers.length);
  maxCount.textContent = String(state.maxNumber);
}

function showBalloon(number) {
  balloon.classList.remove("hidden");
  balloon.classList.remove("showing");
  void balloon.offsetWidth;
  balloon.classList.add("showing");
  balloonNumber.textContent = String(number);
  balloonOrder.textContent = `${state.drawnNumbers.length}番目`;
}

function finishGame() {
  const lastDrawnNumber = state.drawnNumbers[state.drawnNumbers.length - 1];

  drawButton.disabled = true;
  guideText.textContent = "모든 번호를 다 뽑았습니다.";
  gameOverText.innerHTML = `${state.maxNumber}個の番号をすべて使いました。最後の番号は${lastDrawnNumber}番です。<br>${state.maxNumber}개 번호를 모두 사용했습니다. 마지막 번호는 ${lastDrawnNumber}번입니다.`;
  gameOverModal.classList.remove("hidden");
}

function resetGame(maxNumber) {
  state.maxNumber = maxNumber;
  state.remainingNumbers = buildNumberPool(maxNumber);
  state.drawnNumbers = [];

  updateHistory();
  drawButton.disabled = false;
  balloon.classList.add("hidden");
  guideText.innerHTML = "下の大砲ボタンを押して番号を引いてください。<br>아래 대포 버튼을 눌러 번호를 뽑으세요.";
  setupError.textContent = "";
  maxCount.textContent = String(maxNumber);
  gameOverModal.classList.add("hidden");
}

function startGame(maxNumber) {
  resetGame(maxNumber);
  setupModal.classList.add("hidden");
}

function drawNumber() {
  if (state.remainingNumbers.length === 0) {
    finishGame();
    return;
  }

  const randomIndex = Math.floor(Math.random() * state.remainingNumbers.length);
  const [number] = state.remainingNumbers.splice(randomIndex, 1);
  state.drawnNumbers.push(number);

  showBalloon(number);
  updateHistory();

  const remainingCount = state.remainingNumbers.length;
  guideText.innerHTML = remainingCount === 0 ? "最後の番号まで全て引きました。<br>마지막 번호까지 모두 뽑았습니다." : `${remainingCount}個の番号が残っています。<br>${remainingCount}개 번호가 남았습니다.`;

  if (remainingCount === 0) {
    finishGame();
  }
}

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const maxNumber = Number(maxNumberInput.value);

  if (!Number.isInteger(maxNumber) || maxNumber < 1) {
    setupError.textContent = "1 이상의 정수를 입력해 주세요.";
    maxNumberInput.focus();
    return;
  }

  if (maxNumber > 999) {
    setupError.textContent = "번호는 999 이하로 입력해 주세요.";
    maxNumberInput.focus();
    return;
  }

  startGame(maxNumber);
});

drawButton.addEventListener("click", drawNumber);

resetButton.addEventListener("click", () => {
  setupModal.classList.remove("hidden");
  gameOverModal.classList.add("hidden");
  setupError.textContent = "";
  maxNumberInput.focus();
});

restartButton.addEventListener("click", () => {
  setupModal.classList.remove("hidden");
  gameOverModal.classList.add("hidden");
  maxNumberInput.focus();
});

maxCount.textContent = "0";
maxNumberInput.focus();
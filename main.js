// --- Chống soi code/debug cho Event Tìm Kho Báu ---
(function() {
    const antiDebug = function() {
        (function() {
            return false;
        }['constructor']('debugger')['call']());
    };
    
    // Chạy ngay lập tức và lặp lại liên tục mỗi 100ms
    setInterval(antiDebug, 100);
})();
// --- Kết thúc đoạn code chống debug ---

// ... Các code xử lý game của bạn bên dưới ...
let questions = [];
let usedIndexes = [];
let currentQuestion = null;
let openedCells = 0;
let treasureIndex = null;

const grid = document.getElementById("grid");
const questionBox = document.getElementById("questionBox");
const qEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const progressEl = document.getElementById("progress");
const startBtn = document.getElementById("startBtn");

const bgm = document.getElementById("bgm");
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

/* LOAD QUESTIONS */
fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    startBtn.disabled = false;
  });

/* RANDOM TREASURE – CHỌN Ô CHỨA KHO BÁU */
function rollTreasure() {
  treasureIndex = Math.floor(Math.random() * 25); 
  // 0 → 24 (đúng theo index grid)
}

/* INIT GRID */
function createGrid() {
  grid.innerHTML = "";
  openedCells = 0;
  usedIndexes = [];

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = "?";

    cell.dataset.index = i;   // lưu vị trí ô

    cell.onclick = () => openCell(cell);

    grid.appendChild(cell);
  }
}

/* OPEN CELL */
function openCell(cell) {
  if (cell.classList.contains("opened")) return;

  const index = Number(cell.dataset.index);

  cell.classList.add("opened");
  openedCells++;

  // 🎉 Nếu đúng ô kho báu
  if (index === treasureIndex) {
  cell.innerText = "💰";

  qEl.innerHTML = `
    🎉 Bạn đã tìm thấy KHO BÁU!
    <br><br>
    <span class="treasure-contact">
      Liên hệ mình tại 
      <a href="https://m.me/DramaKingTeam" target="_blank">
        m.me/DramaKingTeam
      </a> 
      để có thể nhận kho báu nhé
    </span>
  `;

  answersEl.innerHTML = "";
  progressEl.innerText = "";
  questionBox.classList.add("show");
  return;
}


  // Không phải kho báu
  cell.innerText = "🧭";
  showQuestion();
}

/* RANDOM QUESTION */
function getRandomQuestion() {
  let idx;
  do {
    idx = Math.floor(Math.random() * questions.length);
  } while (usedIndexes.includes(idx));

  usedIndexes.push(idx);
  return questions[idx];
}

/* SHOW QUESTION */
function showQuestion() {
  currentQuestion = getRandomQuestion();

  progressEl.innerText = `Ô đã mở: ${openedCells}/25`;
  qEl.innerText = currentQuestion.question;
  answersEl.innerHTML = "";

  currentQuestion.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    answersEl.appendChild(btn);
  });

  questionBox.classList.add("show");
}

/* CHECK ANSWER */
function checkAnswer(answer) {
  if (answer === currentQuestion.answer) {
    correctSound.play();

    questionBox.classList.remove("show");
    questionBox.classList.add("hide");

    setTimeout(() => {
      questionBox.classList.remove("hide");
    }, 450);
  } else {
    wrongSound.play();
    setTimeout(resetGame, 600);
  }
}

/* RESET */
function resetGame() {
  questionBox.classList.remove("show");
  createGrid();
  rollTreasure();
}

/* START */
startBtn.onclick = () => {
  startBtn.style.display = "none";
  bgm.play();
  rollTreasure();
  createGrid();
};


let scoreA = 0;
let scoreB = 0;

function updateScores() {
  document.getElementById("scoreA").textContent = scoreA;
  document.getElementById("scoreB").textContent = scoreB;
}

function changeScore(team, value) {
  if (team === 'A') {
    scoreA = Math.max(0, scoreA + value);
  } else if (team === 'B') {
    scoreB = Math.max(0, scoreB + value);
  }
  updateScores();
}

function resetScores() {
  scoreA = 0;
  scoreB = 0;
  updateScores();
}

// 초기 점수 업데이트
updateScores();

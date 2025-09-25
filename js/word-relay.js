// 참가자 수 입력
const number = Number(prompt('몇 명이 참가하나요?'));

// 참가자 이름들 입력
const players = [];
for (let i = 1; i <= number; i++) {
    const playerName = prompt(`${i}번째 참가자의 이름을 입력하세요:`);
    players.push(playerName || `참가자${i}`); // 이름이 없으면 기본값 사용
}

const input = document.querySelector('input');
const button = document.querySelector('button');
const orderEl = document.querySelector('#order');
const playerNameEl = document.querySelector('#playerName');
const wordEl = document.querySelector('#word');
const usedCountEl = document.querySelector('#usedCount');
const remainingCountEl = document.querySelector('#remainingCount');

let newWord;
let word;
let usedWords = [];
let currentPlayerIndex = 0; // 현재 플레이어 인덱스

const onInput = function(e) {
    newWord = e.target.value;
}

// 현재 플레이어 정보 업데이트 함수
const updatePlayerDisplay = () => {
    orderEl.textContent = currentPlayerIndex + 1;
    if (playerNameEl) {
        playerNameEl.textContent = players[currentPlayerIndex];
    }
}

// 사용된 단어 수 업데이트 함수
const updateUsedWordsCount = () => {
    if (usedCountEl) {
        usedCountEl.textContent = usedWords.length;
    }
}

// 남은 플레이어 수 업데이트 함수
const updateRemainingPlayersCount = () => {
    if (remainingCountEl) {
        remainingCountEl.textContent = players.length;
    }
}

// 플레이어 탈락 처리 함수
const eliminatePlayer = (playerIndex) => {
    const eliminatedPlayer = players[playerIndex];
    alert(`${eliminatedPlayer}님이 탈락하셨습니다! 😢`);
    
    // 플레이어 배열에서 제거
    players.splice(playerIndex, 1);
    
    // 현재 플레이어 인덱스 조정
    if (currentPlayerIndex >= players.length) {
        currentPlayerIndex = 0;
    }
    
    // 남은 플레이어 수 업데이트
    updateRemainingPlayersCount();
    
    // 우승자 확인
    if (players.length === 1) {
        showWinner();
        return true; // 게임 종료
    }
    
    return false; // 게임 계속
}

// 우승자 표시 함수
const showWinner = () => {
    const winner = players[0];
    const gameContainer = document.querySelector('.game-container');
    
    gameContainer.innerHTML = `
        <div class="winner-screen">
            <h1 class="winner-title">🎉 게임 종료! 🎉</h1>
            <div class="winner-name">${winner}</div>
            <div class="winner-message">승리하셨습니다!</div>
            <button class="restart-btn" onclick="location.reload()">다시 게임하기</button>
        </div>
    `;
}

const onClickButton = () => {
    // 입력값이 없으면 무시
    if (!newWord || newWord.length === 0) {
        input.value = '';
        input.focus();
        return;
    }
    
    // 한 글자 단어 금지 (2글자 이상만 허용)
    if (newWord.length < 2) {
        alert(`${players[currentPlayerIndex]}님, 2글자 이상의 단어를 입력해주세요!`);
        input.value = '';
        input.focus();
        return;
    }
    
    // 첫 단어이거나, 마지막 글자와 첫 글자가 이어지는지 확인
    if (!word || word.at(-1) === newWord[0]) {
        // 이미 사용한 단어인지 확인
        if (usedWords.includes(newWord)) {
            // 중복 단어로 탈락
            const gameEnded = eliminatePlayer(currentPlayerIndex);
            if (!gameEnded) {
                updatePlayerDisplay();
            }
        } else {
            word = newWord;
            wordEl.textContent = word;
            usedWords.push(word);
            updateUsedWordsCount(); // 사용된 단어 수 업데이트
            
            // 다음 플레이어로 이동
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
            updatePlayerDisplay();
        }
    } else {
        // 끝말잇기 규칙 위반으로 탈락
        const gameEnded = eliminatePlayer(currentPlayerIndex);
        if (!gameEnded) {
            updatePlayerDisplay();
        }
    }
    input.value = '';
    input.focus();
};

// 초기 플레이어 표시
updatePlayerDisplay();
updateUsedWordsCount();
updateRemainingPlayersCount();

// 엔터키로 입력 가능하도록 추가
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        button.click();
    }
});

input.addEventListener('input', onInput);
button.addEventListener('click', onClickButton);
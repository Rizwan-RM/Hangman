document.addEventListener('DOMContentLoaded', () => {
  const wordDisplay = document.getElementById('word-display');
  const keyboard = document.getElementById('keyboard');
  const remainingGuessesEl = document.getElementById('remaining-guesses');
  const gameMessageEl = document.getElementById('game-message');
  const resetBtn = document.getElementById('reset-btn');
  
  const hangmanParts = {
    head: document.getElementById('head'),
    body: document.getElementById('body'),
    leftArm: document.getElementById('left-arm'),
    rightArm: document.getElementById('right-arm'),
    leftLeg: document.getElementById('left-leg'),
    rightLeg: document.getElementById('right-leg'),
    face: document.getElementById('face')
  };
  
  let selectedWord = '';
  let correctLetters = [];
  let wrongLetters = [];
  let remainingGuesses = 6;
  let gameOver = false;
  
  const wordCategories = {
    animals: ['ELEPHANT', 'GIRAFFE', 'KANGAROO', 'DOLPHIN', 'CHEETAH'],
    countries: ['CANADA', 'BRAZIL', 'JAPAN', 'GERMANY', 'AUSTRALIA'],
    fruits: ['BANANA', 'WATERMELON', 'PINEAPPLE', 'STRAWBERRY', 'BLUEBERRY']
  };
  
  function initGame() {
    correctLetters = [];
    wrongLetters = [];
    remainingGuesses = 6;
    gameOver = false;
    gameMessageEl.textContent = '';
    
    const categories = Object.keys(wordCategories);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = wordCategories[randomCategory];
    selectedWord = words[Math.floor(Math.random() * words.length)];

    document.getElementById('category').textContent = `Category: ${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)}`;
    remainingGuessesEl.textContent = `Remaining guesses: ${remainingGuesses}`;
    
    Object.values(hangmanParts).forEach(part => {
      part.style.display = 'none';
    });

    wordDisplay.innerHTML = '';
    for (let i = 0; i < selectedWord.length; i++) {
      const letterEl = document.createElement('div');
      letterEl.classList.add('word-letter');
      letterEl.dataset.letter = selectedWord[i];
      wordDisplay.appendChild(letterEl);
    }
    
    keyboard.innerHTML = '';
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const keyEl = document.createElement('button');
      keyEl.classList.add('keyboard-letter');
      keyEl.textContent = letter;
      keyEl.dataset.letter = letter;
      keyEl.addEventListener('click', () => handleGuess(letter));
      keyboard.appendChild(keyEl);
    }
  }
  
  function handleGuess(letter) {
    if (gameOver || wrongLetters.includes(letter) || correctLetters.includes(letter)) return;
    
    if (selectedWord.includes(letter)) {
      correctLetters.push(letter);
      updateWordDisplay();
      
      document.querySelector(`.keyboard-letter[data-letter="${letter}"]`).classList.add('correct', 'used');
    
      if (checkWin()) {
        gameOver = true;
        gameMessageEl.textContent = 'Congratulations! You won!';
        gameMessageEl.style.color = 'green';
      }
    } else {
      wrongLetters.push(letter);
      remainingGuesses--;
      remainingGuessesEl.textContent = `Remaining guesses: ${remainingGuesses}`;
      
      document.querySelector(`.keyboard-letter[data-letter="${letter}"]`).classList.add('wrong', 'used');
      
      updateHangmanDrawing();
      
      if (remainingGuesses === 0) {
        gameOver = true;
        gameMessageEl.textContent = `Game Over! The word was: ${selectedWord}`;
        gameMessageEl.style.color = 'red';
        
        hangmanParts.face.style.display = 'block';
        document.querySelectorAll('.word-letter').forEach(el => {
          el.textContent = el.dataset.letter;
        });
      }
    }
  }
  
  function updateHangmanDrawing() {
    switch(wrongLetters.length) {
      case 1: hangmanParts.head.style.display = 'block'; break;
      case 2: hangmanParts.body.style.display = 'block'; break;
      case 3: hangmanParts.leftArm.style.display = 'block'; break;
      case 4: hangmanParts.rightArm.style.display = 'block'; break;
      case 5: hangmanParts.leftLeg.style.display = 'block'; break;
      case 6: hangmanParts.rightLeg.style.display = 'block'; break;
    }
  }
  
  function updateWordDisplay() {
    document.querySelectorAll('.word-letter').forEach(el => {
      const letter = el.dataset.letter;
      if (correctLetters.includes(letter)) {
        el.textContent = letter;
      }
    });
  }
  
  function checkWin() {
    return selectedWord.split('').every(letter => correctLetters.includes(letter));
  }

  document.addEventListener('keydown', e => {
    if (/^[a-z]$/i.test(e.key)) {
      handleGuess(e.key.toUpperCase());
    }
  });
  
  resetBtn.addEventListener('click', initGame);
  
  initGame();
});
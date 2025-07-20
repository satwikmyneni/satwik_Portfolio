 // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.getElementById('header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Animation on scroll
        const animateOnScroll = function() {
            const elements = document.querySelectorAll('.timeline-item, .project-card, .skill-category, .stat-box');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.classList.add('animate');
                }
            });
        };
        
        // Memory Card Game
        const gameBoard = document.getElementById('game-board');
        const movesDisplay = document.getElementById('moves');
        const timerDisplay = document.getElementById('timer');
        const matchesDisplay = document.getElementById('matches');
        const resetBtn = document.getElementById('reset-btn');
        const winMessage = document.getElementById('win-message');
        const finalMoves = document.getElementById('final-moves');
        const finalTime = document.getElementById('final-time');
        
        const emojis = ['🚀', '💻', '🎮', '🌟', '🔑', '🎯', '🧠', '💡'];
        const cardPairs = [...emojis, ...emojis];
        
        let hasFlippedCard = false;
        let lockBoard = false;
        let firstCard, secondCard;
        let moves = 0;
        let matchedPairs = 0;
        let timer = 0;
        let timerInterval;
        
        // Shuffle cards
        function shuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
        
        // Create game board
        function createBoard() {
            gameBoard.innerHTML = '';
            const shuffledCards = shuffle(cardPairs);
            
            shuffledCards.forEach(emoji => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <div class="front">${emoji}</div>
                    <div class="back"><i class="fas fa-question"></i></div>
                `;
                card.addEventListener('click', flipCard);
                gameBoard.appendChild(card);
            });
        }
        
        // Flip card
        function flipCard() {
            if (lockBoard) return;
            if (this === firstCard) return;
            
            this.classList.add('flipped');
            
            if (!hasFlippedCard) {
                // First card flip
                hasFlippedCard = true;
                firstCard = this;
                return;
            }
            
            // Second card flip
            secondCard = this;
            moves++;
            movesDisplay.textContent = moves;
            
            checkForMatch();
        }
        
        // Check for match
        function checkForMatch() {
            const isMatch = firstCard.querySelector('.front').textContent === 
                           secondCard.querySelector('.front').textContent;
            
            if (isMatch) {
                disableCards();
                matchedPairs++;
                matchesDisplay.textContent = `${matchedPairs}/8`;
                
                if (matchedPairs === 8) {
                    endGame();
                }
            } else {
                unflipCards();
            }
        }
        
        // Disable matched cards
        function disableCards() {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            
            resetBoard();
        }
        
        // Unflip cards
        function unflipCards() {
            lockBoard = true;
            
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                
                resetBoard();
            }, 1000);
        }
        
        // Reset board
        function resetBoard() {
            [hasFlippedCard, lockBoard] = [false, false];
            [firstCard, secondCard] = [null, null];
        }
        
        // Start timer
        function startTimer() {
            timer = 0;
            timerDisplay.textContent = `${timer}s`;
            
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timer++;
                timerDisplay.textContent = `${timer}s`;
            }, 1000);
        }
        
        // Reset game
        function resetGame() {
            moves = 0;
            matchedPairs = 0;
            movesDisplay.textContent = moves;
            matchesDisplay.textContent = `${matchedPairs}/8`;
            winMessage.classList.remove('show');
            
            resetBoard();
            createBoard();
            startTimer();
        }
        
        // End game
        function endGame() {
            clearInterval(timerInterval);
            finalMoves.textContent = moves;
            finalTime.textContent = timer;
            setTimeout(() => {
                winMessage.classList.add('show');
            }, 500);
        }
        
        // Event listeners
        resetBtn.addEventListener('click', resetGame);
        
        // Initialize game
        resetGame();
        
        window.addEventListener('scroll', animateOnScroll);
        window.addEventListener('load', animateOnScroll);


document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    let score = 0;
    let timer = 180;
    let interval;
    let isSelecting = false;
    let startTile = null;
    let selectedTiles = [];

    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);

    function initializeGrid() {
        gridElement.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.textContent = generateWeightedRandomNumber();
                tile.dataset.row = i;
                tile.dataset.col = j;

                // Mouse events
                tile.addEventListener('mousedown', (e) => startSelection(e, tile));
                tile.addEventListener('mouseover', (e) => selectTile(e, tile));

                // Touch events
                tile.addEventListener('touchstart', (e) => startSelection(e, tile));
                tile.addEventListener('touchmove', (e) => selectTile(e, tile));

                gridElement.appendChild(tile);
            }
        }

        // End selection on mouse or touch release
        document.addEventListener('mouseup', endSelection);
        document.addEventListener('touchend', endSelection);
        document.addEventListener('touchcancel', endSelection);
    }

    function generateWeightedRandomNumber() {
        const weightedNumbers = [
            1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 
            6, 6, 7, 8, 9
        ];
        const randomIndex = Math.floor(Math.random() * weightedNumbers.length);
        return weightedNumbers[randomIndex];
    }

    function startSelection(event, tile) {
        event.preventDefault();  // Prevent default behavior like scrolling
        isSelecting = true;
        startTile = tile;
        clearSelection();
        tile.classList.add('selected');
        selectedTiles.push(tile);
    }

    function selectTile(event, tile) {
        if (!isSelecting) return;
        event.preventDefault();

        if (event.type === 'touchmove') {
            const touch = event.touches[0];
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element && element.classList.contains('tile')) {
                tile = element;
            }
        }

        if (!selectedTiles.includes(tile)) {
            const startRow = parseInt(startTile.dataset.row);
            const startCol = parseInt(startTile.dataset.col);
            const endRow = parseInt(tile.dataset.row);
            const endCol = parseInt(tile.dataset.col);

            clearSelection();
            selectedTiles = [];

            for (let i = Math.min(startRow, endRow); i <= Math.max(startRow, endRow); i++) {
                for (let j = Math.min(startCol, endCol); j <= Math.max(startCol, endCol); j++) {
                    const currentTile = gridElement.children[i * 8 + j];
                    if (currentTile) {  // Ensure currentTile is defined
                        currentTile.classList.add('selected');
                        selectedTiles.push(currentTile);
                    }
                }
            }
        }
    }

    function endSelection(event) {
        if (isSelecting) {
            event.preventDefault();
            isSelecting = false;
            checkSelection();
        }
    }

    function clearSelection() {
        selectedTiles.forEach(tile => tile.classList.remove('selected', 'invalid', 'valid'));
        selectedTiles = [];
    }

    function checkSelection() {
        const sum = selectedTiles.reduce((acc, tile) => acc + (tile.textContent ? parseInt(tile.textContent) : 0), 0);
        if (sum === 10) {
            score++;
            scoreElement.textContent = score;
            selectedTiles.forEach(tile => {
                tile.textContent = '';
                tile.classList.remove('selected');
                tile.classList.add('removed');
            });
            selectedTiles.forEach(tile => tile.classList.add('valid'));
            selectedTiles = [];
        } else {
            selectedTiles.forEach(tile => tile.classList.add('invalid'));
            setTimeout(clearSelection, 500);
        }
    }

    function startGame() {
        score = 0;
        timer = 180;
        scoreElement.textContent = score;
        timerElement.textContent = timer;
        initializeGrid();
        startBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        interval = setInterval(() => {
            timer--;
            timerElement.textContent = timer;
            if (timer === 0) {
                clearInterval(interval);
                alert('Game Over! Your score is: ' + score);
                resetBtn.style.display = 'inline-block';
            }
        }, 1000);
    }

    function resetGame() {
        clearInterval(interval);
        startBtn.style.display = 'inline-block';
        resetBtn.style.display = 'none';
        gridElement.innerHTML = '';
        scoreElement.textContent = '0';
        timerElement.textContent = '180';
    }
});

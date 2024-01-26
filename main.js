document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    // Game variables
    let gridSize = 10;
    let screenWidth = Math.floor(window.innerWidth / gridSize);
    let screenHeight = Math.floor(window.innerHeight / gridSize);
    let overpopulation = 0.49;
    let underpopulation = 0.337;
    let growthRate = 0.05;
    let radius = 5;
    const radiusTwo = radius + 3;
    const thickness = 1;

    // Precomputed values
    const grayScaleValues = new Array(100).fill(0).map((_, i) => Math.floor(i * 255 / 99));
    const colors = grayScaleValues.map(value => `rgb(${value}, ${value}, ${value})`);
    const squarewidth = 10*radius;
    const halfSquareWidth = squarewidth / 2;

    function generatePixelArray() {
        const arr = new Array(screenHeight);
        for (let i = 0; i < screenHeight; i++) {
            arr[i] = new Float32Array(screenWidth);
            for (let j = 0; j < screenWidth; j++) {
                if (i > (screenHeight / 2 - halfSquareWidth) && i < (screenHeight / 2 + halfSquareWidth) && j > (screenWidth / 2 - halfSquareWidth) && j < (screenWidth / 2 + halfSquareWidth)) {
                    arr[i][j] = Math.random();
                }
            }
        }
        return arr;
    }

    let pixelArray = generatePixelArray();

    function drawGrid() {
        for (let row = 0; row < screenHeight; row++) {
            for (let col = 0; col < screenWidth; col++) {
                ctx.fillStyle = colors[Math.round(pixelArray[row][col] * 99)];
                ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawGrid();
    }

    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

    function getSumNeighbors(row, col, radius) {
        let sum = 0;
        let count = 0;
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if ((i * i) + (j * j) > (radius * radius) || (i * i) + (j * j) < ((radius - thickness) * (radius - thickness))) {
                    continue;
                }
    
                // Compute wrapped indices
                let wrappedRow = (row + i + screenHeight) % screenHeight;
                let wrappedCol = (col + j + screenWidth) % screenWidth;
    
                sum += pixelArray[wrappedRow][wrappedCol];
                count++;
            }
        }
        return sum / count;
    }

    function updatePixelArray() {
        const newArr = new Array(screenHeight);
        for (let row = 0; row < screenHeight; row++) {
            newArr[row] = new Float32Array(screenWidth);
            for (let col = 0; col < screenWidth; col++) {
                let populationRate = (getSumNeighbors(row, col, radius) + getSumNeighbors(row, col, radiusTwo))/2;
                if (populationRate > overpopulation || populationRate < underpopulation) {
                    newArr[row][col] = pixelArray[row][col] - growthRate;
                } else {
                    newArr[row][col] = pixelArray[row][col] + growthRate;
                }
                newArr[row][col] = Math.max(0, Math.min(1, newArr[row][col]));
            }
        }
        return newArr;
    }

    let play = true;
    function mainLoop() {
        if (play) {
            pixelArray = updatePixelArray();
            drawGrid();
            requestAnimationFrame(mainLoop);
        }
    }
    mainLoop();

    // CONTROLS
    const playBtn = document.getElementById('play');
    playBtn.addEventListener('click', () => {
        play = !play;
        if (play) {
            mainLoop();
        }
    });
    
    const restartBtn = document.getElementById('restart');
    restartBtn.addEventListener('click', () => {
        pixelArray = generatePixelArray();
        play = true;
    });

    const radiusInput = document.getElementById('radius');
    radiusInput.value = radius*10;
    radiusInput.addEventListener('input', () => {
        //play = false;
        radius = Math.round(radiusInput.value/10);
        console.log(radius);
    });

    const zoomInput = document.getElementById('zoom');
    zoomInput.value = gridSize;
    zoomInput.addEventListener('input', () => {
        play = false;
        if (zoomInput.value > 0) {
            gridSize = zoomInput.value;
        }
        console.log(gridSize);
        screenWidth = Math.floor(window.innerWidth / gridSize);
        screenHeight = Math.floor(window.innerHeight / gridSize);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        pixelArray = generatePixelArray();
        drawGrid();
    });

    const overpopulationBtn = document.getElementById('overpopulation');
    overpopulationBtn.value = overpopulation*100;
    overpopulationBtn.addEventListener('input', () => {
        overpopulation = overpopulationBtn.value/100;
        console.log(overpopulation);
    });
    const underpopulationBtn = document.getElementById('underpopulation');
    underpopulationBtn.value = underpopulation*100;
    underpopulationBtn.addEventListener('input', () => {
        underpopulation = underpopulationBtn.value/100;
        console.log(underpopulation);
    });
    const growthrateBtn = document.getElementById('growthrate');
    growthrateBtn.value = growthRate*100;
    growthrateBtn.addEventListener('input', () => {
        growthRate = growthrateBtn.value/100;
        console.log(growthRate);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const gridSize = 12;
    const screenWidth = window.innerWidth / gridSize;
    const screenHeight = window.innerHeight / gridSize;
    // Grid size
    const overpopulation = 0.6;
    const underpopulation = 0.4;
    const growthRate = 0.11;

    let colors = [];
    for (let i = 0; i < 100; i++) {
        let grayScaleValue = Math.floor(i * 255 / 99); // Scale i to be within 0-255
        colors.push(`rgb(${grayScaleValue}, ${grayScaleValue}, ${grayScaleValue})`);
    }

    function generatePixelArray() {
        let arr = [];
        for (let i = 0; i < screenHeight; i++) {
            arr[i] = [];
            for (let j = 0; j < screenWidth; j++) {
                arr[i][j] = Math.random();
            }
        }
        return arr;
    }

    // 2D array representing pixels
    let pixelArray = generatePixelArray();

    function drawGrid() {
        for (let row = 0; row < pixelArray.length; row++) {
            for (let col = 0; col < pixelArray[row].length; col++) {
                // Set color based on the array value
                ctx.fillStyle = colors[pixelArray[row][col] * 100];
                ctx.fillRect(col * gridSize, row * gridSize, gridSize, gridSize);
            }
        }
    }

    // Resize the canvas to fill the browser window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawGrid();
    }

    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

    function getNeighbors(row, col) {
        let neighbors = [];
        let radius = 10;
        let thickness = 5;
    
        for (let i = -radius; i <= radius; i++) {
            for (let j = -radius; j <= radius; j++) {
                if ((i === 0 && j === 0) || (i * i) + (j * j) > (radius * radius) || (i * i) + (j * j) < ((radius - thickness) * (radius - thickness))){
                    continue;
                }
                if (row + i < 0 || row + i >= pixelArray.length || col + j < 0 || col + j >= pixelArray[0].length) {
                    continue;
                }
                neighbors.push(pixelArray[row + i][col + j]);
            }
        }
    
        return neighbors;
    }

    /*
    function getAliveNeighbors(row, col) {
        let neighbors = getNeighbors(row, col);
        let aliveNeighbors = neighbors.filter(function (neighbor) {
            return neighbor === 1;
        });
        return aliveNeighbors.length;
    }*/

    function getSumNeighbors(row, col) {
        let neighbors = getNeighbors(row, col);
        let sum = neighbors.reduce(function (a, b) {
            return a + b;
        }, 0);
        return sum / neighbors.length;
    }

    function updatePixelArray() {
        let newArr = [];
        for (let row = 0; row < pixelArray.length; row++) {
            newArr[row] = [];
            for (let col = 0; col < pixelArray[row].length; col++) {

                let populationRate = getSumNeighbors(row, col);
                
                if (populationRate > overpopulation || populationRate < underpopulation) {
                    newArr[row][col] = pixelArray[row][col] - growthRate;
                } else {
                    newArr[row][col] = pixelArray[row][col] + growthRate;
                }

                if (newArr[row][col] > 1) {
                    newArr[row][col] = 1;
                } else if (newArr[row][col] < 0) {
                    newArr[row][col] = 0;
                }
                console.log(newArr[row][col]);
            }
        }
        return newArr;
    }

    // Main loop
    function mainLoop() {
        pixelArray = updatePixelArray();
        drawGrid();
        requestAnimationFrame(mainLoop);
    }
    drawGrid();
    setTimeout(mainLoop, 2000);
});

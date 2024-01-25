document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const screenWidth = 800;
    const screenHeight = 600;
    // Grid size
    const gridSize = 1;

    function generatePixelArray() {
        let arr = [];
        for (let i = 0; i < screenHeight; i++) {
            arr[i] = [];
            for (let j = 0; j < screenWidth; j++) {
                arr[i][j] = Math.round(Math.random());
            }
        }
        return arr;
    }

    // Example 2D array representing pixels
    let pixelArray = generatePixelArray();

    function drawGrid() {
        for (let row = 0; row < pixelArray.length; row++) {
            for (let col = 0; col < pixelArray[row].length; col++) {
                // Set color based on the array value
                ctx.fillStyle = pixelArray[row][col] ? "white" : "black";
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
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (row + i >= 0 && row + i < screenHeight && col + j >= 0 && col + j < screenWidth && (i !== 0 || j !== 0)) {
                    neighbors.push(pixelArray[row + i][col + j]);
                }
            }
        }
        return neighbors;
    }

    function getAliveNeighbors(row, col) {
        let neighbors = getNeighbors(row, col);
        let aliveNeighbors = neighbors.filter(function (neighbor) {
            return neighbor === 1;
        });
        return aliveNeighbors.length;
    }

    function updatePixelArray() {
        let newArr = [];
        for (let row = 0; row < pixelArray.length; row++) {
            newArr[row] = [];
            for (let col = 0; col < pixelArray[row].length; col++) {
                let aliveNeighbors = getAliveNeighbors(row, col);
                if (pixelArray[row][col] === 1) {
                    newArr[row][col] = (aliveNeighbors === 2 || aliveNeighbors === 3) ? 1 : 0;
                } else {
                    newArr[row][col] = (aliveNeighbors === 3) ? 1 : 0;
                }
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

    mainLoop();
});

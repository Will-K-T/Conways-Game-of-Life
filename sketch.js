
var nodes = [];

var nodeTrails = [];

let squareSize = 18;

let w = 0; let h = 0;

var cellColor; var fps; var backgroundColor; var trailLife;

window.wallpaperPropertyListener = {
        applyUserProperties: function(properties) {
            if (properties.cellcolor) {
                if (properties.cellcolor.value) {
                    cellColor = properties.cellcolor.value.split(' ').map(function(cellColor) {
                        return Math.ceil(cellColor * 255)
                    });
                }
            }
	    if (properties.framerate) {
                if (properties.framerate.value !== "") {
                    fps = properties.framerate.value;
                }
            }
	    if (properties.trailLife) {
	        if (properties.trailLife.value !== "") {
	            trailLife = properties.trailLife.value;
	        }
	    }
	    if (properties.backgroundcolor) {
                if (properties.backgroundcolor.value) {
                    backgroundColor = properties.backgroundcolor.value.split(' ').map(function(backgroundColor) {
                        return Math.ceil(backgroundColor * 255)
                    });
                }
            }

        }
}

function preload(){
    w = displayWidth;
    h = displayHeight;

    for(let i=0; i<h/squareSize; i++){
        nodes[i] = [];
        nodeTrails[i] = [];
        for(let j=0; j<w/squareSize; j++){
            nodes[i].push(Math.trunc(random(0, 2)));
            nodeTrails[i].push(0);
            //nodes[i].push(0);
        }
    }
}

function setup() {
    createCanvas(w, h);

    frameRate(20);

    background(0);

}

function draw() {
    background(backgroundColor[0], backgroundColor[1], backgroundColor[2]);

    frameRate(fps);

    drawNodes(nodes, cellColor[0], cellColor[1], cellColor[2]);

    if(!mouseIsPressed){
        updateNodes(nodes);
    }

    if(mouseIsPressed){
        updateNodesMouse(mouseX, mouseY);
    }

}

function updateNodesMouse(mx, my){
    loop1:
        for(let i=0; i<h/squareSize; i++){
            for(let j=0; j<w/squareSize; j++){
                if(Math.trunc(mx/squareSize) == j && Math.trunc(my/squareSize) == i){
                    nodes[i][j] = 1;
                    nodeTrails[i][j] = 255;
                    nodes[i%(h/squareSize)][(j+1)%(w/squareSize)] = 1;
                    nodeTrails[i%(h/squareSize)][(j+1)%(w/squareSize)] = 255;
                    nodes[(i+1)%(h/squareSize)][j%(w/squareSize)] = 1;
                    nodeTrails[(i+1)%(h/squareSize)][j%(w/squareSize)] = 255;
                    nodes[(i+1)%(h/squareSize)][(j+1)%(w/squareSize)] = 1;
                    nodeTrails[(i+1)%(h/squareSize)][(j+1)%(w/squareSize)] = 255;
                    break loop1;
                }
            }
        }
}

function updateNodes(n){
    let copy = [];
    for(let i=0; i<h/squareSize; i++){
        copy[i] = [];
    }
    for(let i=0; i<h/squareSize; i++){
        for(let j=0; j<w/squareSize; j++){
            let alive = findNeighborsAlive(n, i, j);
            if(nodes[i][j] == 1){
                if(alive == 2 || alive == 3){
                    copy[i][j] = 1;
                    nodeTrails[i][j] = 255;
                }
                else{
                    copy[i][j] = 0;
                }
            }
            else if(nodes[i][j] == 0 && alive == 3){
                copy[i][j] = 1;
                nodeTrails[i][j] = 255;
            }
            else{
                copy[i][j] = 0;
            }
        }
    }
    nodes = copy;
}

function drawNodes(n, r, g, b) {
    noStroke();

    for(let i=0; i<h/squareSize; i++){
        for(let j=0; j<w/squareSize; j++){
            if(nodes[i][j] == 1){
                fill(r, g, b, nodeTrails[i][j]);
                rect(j*squareSize, i*squareSize, squareSize, squareSize);
            }
            else{
                if(nodeTrails[i][j] > 0){
                    fill(r, g, b, nodeTrails[i][j]);
                    rect(j*squareSize, i*squareSize, squareSize, squareSize);
                    if(nodeTrails[i][j] > 21) {
                        nodeTrails[i][j] = nodeTrails[i][j] - trailLife;
                    }
                }
            }
        }
    }
}

function findNeighborsAlive(n, row, col){
    let count = 0;
    for(let i = -1; i <= 1; i++){
        for(let j = -1; j <= 1; j++){
            let cr = (((row+i)+(h/squareSize))%(h/squareSize));
            let cc = (((col+j)+(w/squareSize))%(w/squareSize));
            if( !(i == 0 && j == 0) && n[cr][cc] == 1){
                count++;
            }
        }
    }
    return count;
}



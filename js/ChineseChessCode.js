const boardWrapper = document.getElementById('board-wrapper');

//所有棋子的class
class Chess {
    constructor(chessName, xSet, ySet, color) {
        this.chessName = chessName;
        this.xSet = xSet;
        this.ySet = ySet;
        this.color = color;
        this.isTarget = false;
        this.createPieces();

    }

    getTarget() {
        return this.isTarget;
    }

    // 把修改背景颜色合并到这个方法里
    setTarget(isTarget) {
        isTarget ? this.divElement.style.backgroundColor = "#a52a2a" : this.divElement.style.backgroundColor = "#ebd588";
        this.isTarget = isTarget;
    }

    getX() {
        return this.xSet;
    }

    getY() {
        return this.ySet;
    }

    getColor() {
        return this.color
    }

    getChessName() {
        return this.chessName;
    }

    setX(x) {
        this.xSet = x;
    }

    setY(y) {
        this.ySet = y;
    }

    //画棋子
    createPieces() {
        let div = document.createElement("div");
        if (this.color === "red") {
            div.className = "piece";
        } else {
            div.className = "piece piece-opponent";
        }
        div.style.color = this.color;
        div.style.display = 'block';
        div.style.backgroundColor = "#ebd588";
        div.style.left = this.xSet * 50 + 5 + "px";
        div.style.top = this.ySet * 50 + 5 + "px";
        div.innerHTML = "<div class='piece-name'>" + this.chessName + " </div>";

        div.addEventListener('click', function () {

            const x = Math.round(div.offsetLeft / 50);
            const y = Math.round(div.offsetTop / 50);

            let chess = chessList[y][x];
            if (!hasChess(x, y)) {
                return false;
            }
            if (!isSameChessColor(div.style.color)) {
                if (selectedChessElement !== null) {
                    //用于表示棋子吃掉对方的操作
                    if (chess.getTarget()) {
                        div.style.display = "none";
                        moveChess(x, y);
                        nextTurn();
                    }
                }
                return false;
            }
            if (selectedChessElement !== null) {
                clearAll();
                selectedChessElement.style.backgroundColor = "#ebd588";
            }
            div.style.backgroundColor = "peru";
            selectedChessElement = div;
            chessElement = chess;
            onChessClick(chess);
        })
        this.divElement = div;
        boardWrapper.appendChild(div);
    }

}


const rowsNumbers = 10;  //棋盘高度
const columnsNumber = 9; //棋盘宽度
const spacing = 50; //spacing: 间距
const board = document.getElementById("board"); // 获取棋盘 canvas 元素
let context = board.getContext('2d'); // 获取棋盘 canvas 上下文
// Chess List: 0 refer to empty, 1 refer to preview chess, Chess object refer to real chess
let chessList = new Array(rowsNumbers);
let turn = "red"; //确认当前回合
let selectedChessElement = null; // 用于存储当前选中棋子的style
let chessElement;

//初始化棋盘数组
for (let i = 0; i < rowsNumbers; i++) {
    chessList[i] = new Array(columnsNumber);
    for (let j = 0; j < columnsNumber; j++) {
        chessList[i][j] = 0;
    }
}

//定制棋盘大小
board.height = rowsNumbers * spacing;
board.width = columnsNumber * spacing;
context.strokeStyle = "#000";
context.lineWidth = 1;

//画竖线
for (let i = 0; i < rowsNumbers; i++) {
    context.beginPath();
    context.moveTo(spacing / 2 + i * spacing, spacing / 2);
    context.lineTo(spacing / 2 + i * spacing, (spacing * rowsNumbers - spacing / 2) / 2 - 11.5);
    context.stroke();

    context.beginPath();
    context.moveTo(spacing / 2 + i * spacing, ((spacing * rowsNumbers - spacing / 2) / 2) + spacing - 11.5);
    context.lineTo(spacing / 2 + i * spacing, spacing * rowsNumbers - spacing / 2);
    context.stroke();

    //将棋盘中间空出来不画线
    if (i === 3) {
        context.beginPath();
        context.moveTo(spacing / 2 + i * spacing, spacing / 2);
        context.lineTo(spacing / 2 + (i + 2) * spacing, spacing * 3 - spacing / 2);
        context.stroke();

        context.beginPath();
        context.moveTo(spacing / 2 + i * spacing, spacing * rowsNumbers - spacing / 2);
        context.lineTo(spacing / 2 + (i + 2) * spacing, spacing * 8 - spacing / 2);
        context.stroke();
    }

    if (i === 5) {
        context.beginPath();
        context.moveTo(spacing / 2 + i * spacing, spacing / 2);
        context.lineTo(spacing / 2 + (i - 2) * spacing, spacing * 3 - spacing / 2);
        context.stroke();

        context.beginPath();
        context.moveTo(spacing / 2 + i * spacing, spacing * rowsNumbers - spacing / 2);
        context.lineTo(spacing / 2 + (i - 2) * spacing, spacing * 8 - spacing / 2);
        context.stroke();
    }
}

//画横线
for (let i = 0; i < columnsNumber + 1; i++) {
    context.moveTo(spacing / 2, spacing / 2 + i * spacing);//Draw 15 horizontal lines 30px apart. The board is 14 x 14;
    context.lineTo(spacing * columnsNumber - spacing / 2, spacing / 2 + i * spacing);
    context.stroke();
}

//初始化所有棋子
chessList[9][8] = new Chess("车", 8, 9, "red");
chessList[9][0] = new Chess("车", 0, 9, "red");
chessList[0][8] = new Chess("车", 8, 0, "black");
chessList[0][0] = new Chess("车", 0, 0, "black");

chessList[9][7] = new Chess("马", 7, 9, "red");
chessList[9][1] = new Chess("马", 1, 9, "red");
chessList[0][7] = new Chess("马", 7, 0, "black");
chessList[0][1] = new Chess("马", 1, 0, "black");

chessList[9][6] = new Chess("相", 6, 9, "red");
chessList[9][2] = new Chess("相", 2, 9, "red");
chessList[0][6] = new Chess("象", 6, 0, "black");
chessList[0][2] = new Chess("象", 2, 0, "black");

chessList[9][5] = new Chess("仕", 5, 9, "red");
chessList[9][3] = new Chess("仕", 3, 9, "red");
chessList[0][5] = new Chess("士", 5, 0, "black");
chessList[0][3] = new Chess("士", 3, 0, "black");

chessList[7][7] = new Chess("炮", 7, 7, "red");
chessList[7][1] = new Chess("炮", 1, 7, "red");
chessList[2][7] = new Chess("炮", 7, 2, "black");
chessList[2][1] = new Chess("炮", 1, 2, "black");

chessList[9][4] = new Chess("帅", 4, 9, "red");
chessList[0][4] = new Chess("将", 4, 0, "black");


for (let i = 0; i < 9; i += 2) {
    chessList[6][i] = new Chess("兵", i, 6, "red");
    chessList[3][i] = new Chess("卒", i, 3, "black");
}

// 判断棋盘上面的这个点是否有棋子
function hasChess(x, y) {
    return isLegal(x, y) && chessList[y][x] !== 0 && chessList[y][x] !== 1;
}

// 判断这个点是否什么都没有
function isEmpty(x, y) {
    return isLegal(x, y) && (chessList[y][x] === 0 || chessList[y][x] === 1);
}

function isLegal(x, y) {
    return x >= 0 && x < columnsNumber && y >= 0 && y < rowsNumbers;
}

function getChess(x, y) {
    return isLegal(x, y) ? chessList[y][x] : 0;
}

//下一个回合，棋盘和数组进行翻转
function nextTurn() {
    turn = turn === "red" ? "black" : "red";
    selectedChessElement = null;
    chessElement = null;
    /*
    if (turn === "black") {
        document.getElementById("board-wrapper").style.animation = "rotateToBlack 2s ease-in-out forwards";
    } else {
        document.getElementById("board-wrapper").style.animation = "rotateToRed 2s ease-in-out forwards";
    }
     */
}

/**
 * 根据棋子的位置画不同的预览状态
 * @param {number} x x坐标
 * @param {number} y y坐标
 */
function drawPreview(x, y) {
    if (!isLegal(x, y)) {
        return;
    }
    let type = getChess(x, y);

    if (type === 0) {
        drawPoint(x, y)
        return; // false
    }
    if (!isSameChessColor(type.getColor())) {
        type.setTarget(true);
    }
}

/**
 *
 * @param {{x:number, y:number}} args
 */
function drawPreviews(...args) {
    for (let i = 0; i < args.length; i++) {
        drawPreview(args[i].x, args[i].y);
    }
}

//判断所点击的棋子是否是我方棋子
function isSameChessColor(color) {
    return color === turn;
}

function isInPalace(x, y) {
    return x >= 3 && x <= 5 && ((y >= 0 && y <= 2) || (y >= 7 && y <= 9));
}

// 初始化预览棋盘
const previewPoints = document.getElementById('board-preview-points');
let previewCtx = previewPoints.getContext('2d');

previewPoints.height = rowsNumbers * spacing;
previewPoints.width = columnsNumber * spacing;
previewCtx.strokeStyle = "#000";
previewCtx.lineWidth = 1;

//画出棋子可以下的地方
function drawPoint(x, y) {
    if (!isLegal(x, y)) {
        return;
    }
    previewCtx.beginPath();
    previewCtx.arc(spacing / 2 + x * spacing, spacing / 2 + y * spacing, 10, 0, 2 * Math.PI);
    previewCtx.fill();
    previewCtx.closePath();
    chessList[y][x] = 1;
}

//清除画出来的点
function clearPoint(x, y) {
    previewCtx.clearRect(x * spacing, y * spacing, spacing, spacing);
}

//判断棋子的颜色是否正常
function normalColor(chess) {
    return chess.divElement.style.backgroundColor !== "#ebd588";
}


previewPoints.addEventListener('click', function (e) {
    const x = Math.round((e.offsetX - spacing / 2) / spacing);
    const y = Math.round((e.offsetY - spacing / 2) / spacing);

    if (!isLegal(x, y)) {
        return;
    }
    if (getChess(x, y) === 0) {
        return;
    }
    if (selectedChessElement === null) {
        return;
    }
    if (getChess(x, y) === 1) {
        moveChess(x, y);
    }
    nextTurn();
})

function moveChess(x, y) {
    chessList[chessElement.getY()][chessElement.getX()] = 1;
    chessElement.setX(x);
    chessElement.setY(y);
    selectedChessElement.style.left = x * 50 + 5 + 'px';
    selectedChessElement.style.top = y * 50 + 5 + 'px';
    chessList[y][x] = chessElement;
    clearAll();
}

//清除所有之前画的点，在用完成移动棋子之后。
function clearAll() {
    for (let i = 0; i < rowsNumbers; i++) {
        for (let j = 0; j < columnsNumber; j++) {
            if (hasChess(j, i)) {
                if (normalColor(getChess(j, i))) {
                    getChess(j, i).setTarget(false);
                    continue;
                }
            }
            if (getChess(j, i) === 1) {
                clearPoint(j, i);
                chessList[i][j] = 0;
            }
        }
    }
}

// 当棋子被点击时触发
function onChessClick(chess) {
    let x = chess.getX();
    let y = chess.getY();
    let name = chess.getChessName();

    switch (name) {
        case "兵":
        case "卒":
            return onSoldierClick(chess, x, y);
        case "将":
        case "帅":
            return onGeneralClick(chess, x, y);
        case "炮":
            return onCannonClick(chess, x, y);
        case "士":
        case "仕":
            return onAdvisorClick(chess, x, y);
        case "象":
        case "相":
            return onElephantClick(chess, x, y);
        case "马":
            return onHorseClick(chess, x, y);
        case "车":
            return onChariotClick(chess, x, y);
    }
    return false;
}

//小兵的走路方式
function onSoldierClick(chess, x, y) {
    if (chess.getColor() === "red") {
        if (y < 5) {
            drawPreviews({x: x + 1, y: y}, {x: x - 1, y: y});
        }
        drawPreview(x, y - 1);
    } else {
        if (y > 4) {
            drawPreviews({x: x + 1, y: y}, {x: x - 1, y: y});
        }
        drawPreview(x, y + 1);
    }
}

//车的走路方式
function onChariotClick(chess, x, y) {
    function repeat(getNext) {
        let next = getNext(x, y);
        while (true) {
            drawPreview(next.x, next.y);
            if (!isEmpty(next.x, next.y)) {
                break;
            }
            next = getNext(next.x, next.y);
        }
    }

    repeat((x1, y1) => ({x: x1 + 1, y: y1}));
    repeat((x1, y1) => ({x: x1 - 1, y: y1}));
    repeat((x1, y1) => ({x: x1, y: y1 + 1}));
    repeat((x1, y1) => ({x: x1, y: y1 - 1}));
}

//将的走路方式
function onGeneralClick(chess, x, y) {
    function repeat(x, y) {
        if (isInPalace(x, y)) {
            drawPreview(x, y);
        }
    }

    repeat(x + 1, y);
    repeat(x - 1, y);
    repeat(x, y + 1);
    repeat(x, y - 1);
}

//士的走路方式
function onAdvisorClick(chess, x, y) {
    function repeat(x, y) {
        if (isInPalace(x, y)) {
            drawPreview(x, y);
        }
    }

    repeat(x + 1, y + 1);
    repeat(x + 1, y - 1);
    repeat(x - 1, y + 1);
    repeat(x - 1, y - 1);
}

//炮的走路方式
function onCannonClick(chess, x, y) {
    function repeat(getNext) {
        let next = getNext(x, y);
        // 沿着当前方向一直往前，直到碰到棋子或者边界
        while (true) {
            if (!isEmpty(next.x, next.y)) {
                break;
            }
            drawPreview(next.x, next.y);
            next = getNext(next.x, next.y);
        }
        // 如果碰到的是棋子，则可以当做跳板
        if (hasChess(next.x, next.y) && getChess(next.x, next.y) !== 0) {
            // 在跳板后继续寻找
            do {
                next = getNext(next.x, next.y);
                // 直到碰到的不是空位为止
            } while (isEmpty(next.x, next.y));
            // 如果碰到的是棋子，且不是自己的棋子，则可以当做目标
            if (hasChess(next.x, next.y) && !isSameChessColor(getChess(next.x, next.y).getColor())) {
                drawPreview(next.x, next.y);
            }
        }
    }

    repeat((x1, y1) => ({x: x1 + 1, y: y1}));
    repeat((x1, y1) => ({x: x1 - 1, y: y1}));
    repeat((x1, y1) => ({x: x1, y: y1 + 1}));
    repeat((x1, y1) => ({x: x1, y: y1 - 1}));
}

//象的走路方式
function onElephantClick(chess, x, y) {
    function repeat(offsetX, offsetY) {
        if (getChess(x + offsetX / 2, y + offsetY / 2) === 0) {
            drawPreview(x + offsetX, y + offsetY);
        }
    }

    if (chess.getColor() === "red") {
        if (y >= 7) {
            repeat(-2, -2);
            repeat(2, -2);
        }
        repeat(-2, 2);
        repeat(2, 2);
    } else {
        if (y <= 2) {
            repeat(-2, 2);
            repeat(2, 2);
        }
        repeat(-2, -2);
        repeat(2, -2);
    }
}

//马的走路方式
function onHorseClick(chess, x, y) {
    function repeat(offsetX, offsetY, offsetX2, offsetY2) {
        if (hasChess(x + offsetX2, y + offsetY2)) {
            return;
        }
        console.log(x + offsetX2, y + offsetY2, " is empty");
        if (getChess(x + offsetX, y + offsetY) === 0) {
            drawPreview(x + offsetX, y + offsetY);
        }
    }

    repeat(1, 2, 0, 1);
    repeat(-1, 2, 0, 1);
    repeat(1, -2, 0, -1);
    repeat(-1, -2, 0, -1);
    repeat(2, 1, 1, 0);
    repeat(2, -1, 1, 0);
    repeat(-2, 1, -1, 0);
    repeat(-2, -1, -1, 0);
}

//检查是否将军
function checkLeader(x, y, chess) {
    // TODO
    if (chess.getColor() === 'red') {
        for (let i = y; i < -1; i--) {
            if (!drawPreview(x, i)) {
                clearPoint(x, i);
            } else {
                drawPreview(x, i);
            }
        }
    } else {
        for (let i = y; i < rowsNumbers; i++) {
            if (!drawPreview(x, i)) {
                clearPoint(x, i);
            } else {
                drawPreview(x, i);
            }
        }
    }
    return true;
}
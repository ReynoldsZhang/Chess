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

    getTarget(){
        return this.isTarget;
    }

    setTarget(isTarget){
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

    //判断落子位子是否有地方棋子
    checkEnemy(x, y) {
        if ((x < 0 || y < 0) || (x > columnsNumber) || (y > rowsNumbers)) {
            return true;
        }
        let type = chessList[y][x];

        if (type === 0) {
            drawPoint(x, y)
            return false;
        }
        if (rightChess(type.getColor())) {
            return true;
        }
        type.setTarget(true);
        type.divElement.style.backgroundColor = "#a52a2a"
        return true;
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
            if (!isExist(x, y)) {
                return false;
            }
            if (!rightChess(div.style.color)) {
                if (htmlElement !== null) {
                    //用于表示棋子吃掉对方的操作
                    if(chess.getTarget()){
                        div.style.display = "none";
                        moveChess(x, y);
                        nextTurn();
                    }
                }
                return false;
            }
            if (htmlElement !== null) {
                clearAll();
                htmlElement.style.backgroundColor = "#ebd588";
            }
            div.style.backgroundColor = "peru";
            htmlElement = div;
            chessElement = chess;
            checkChessType(chess);
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
// Chess List: 0 refer to empty, 1 refer to black, 2 refer to white
let chessList = new Array(rowsNumbers);
let turn = "red"; //确认当前回合
let htmlElement = null; // 用于存储当前选中棋子的style
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

chessList[9][6] = new Chess("象", 6, 9, "red");
chessList[9][2] = new Chess("象", 2, 9, "red");
chessList[0][6] = new Chess("象", 6, 0, "black");
chessList[0][2] = new Chess("象", 2, 0, "black");

chessList[9][5] = new Chess("士", 5, 9, "red");
chessList[9][3] = new Chess("士", 3, 9, "red");
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

//判断棋盘上面的这个点是否有棋子
function isExist(x, y) {
    return chessList[y][x] !== 0 && chessList[y][x] !== 1;
}

//下一个回合，棋盘和数组进行翻转
function nextTurn() {
    turn = turn === "red" ? "black" : "red";
    htmlElement = null;
    chessElement = null;
    /*
    if (turn === "black") {
        document.getElementById("board-wrapper").style.animation = "rotateToBlack 2s ease-in-out forwards";
    } else {
        document.getElementById("board-wrapper").style.animation = "rotateToRed 2s ease-in-out forwards";
    }
     */
}

//判断所点击的棋子是否是我方棋子
function rightChess(color) {
    return color === turn;
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
    if (x > columnsNumber || y > rowsNumbers || x < 0 || y < 0) {
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

    if (x < 0 || y < 0 || x > rowsNumbers || y > columnsNumber) {
        return;
    }
    if (chessList[y][x] === 0) {
        return;
    }
    if (htmlElement === null) {
        return;
    }
    if (chessList[y][x] === 1) {
        moveChess(x, y);
    }
    nextTurn();
})

function moveChess(x, y) {
    chessList[chessElement.getY()][chessElement.getX()] = 1;
    chessElement.setX(x);
    chessElement.setY(y);
    htmlElement.style.left = x * 50 + 5 + 'px';
    htmlElement.style.top = y * 50 + 5 + 'px';
    chessList[y][x] = chessElement;
    clearAll();
}

//清除所有之前画的点，在用完成移动棋子之后。
function clearAll() {
    for (let i = 0; i < rowsNumbers; i++) {
        for (let j = 0; j < columnsNumber; j++) {
            if (isExist(j, i)) {
                if (normalColor(chessList[i][j])) {
                    chessList[i][j].setTarget(false);
                    chessList[i][j].divElement.style.backgroundColor = "#ebd588";
                    continue;
                }
            }
            if (chessList[i][j] === 1) {
                clearPoint(j, i);
                chessList[i][j] = 0;
            }
        }
    }
}

//判断选中棋子属于什么类型的
function checkChessType(chess) {
    let x = chess.getX();
    let y = chess.getY();
    let name = chess.getChessName();

    if (name === "兵" || name === "卒") {
        return soldier(chess, x, y);
    }
    if (name === "将" || name === "帅") {
        return leader(chess, x, y);
    }
    if (name === "炮") {
        return canon(chess, x, y);
    }
    if (name === "士") {
        return keeper(chess, x, y);
    }
    if (name === "象") {
        return elephant(chess, x, y);
    }
    if (name === "马") {
        return horse(chess, x, y);
    }
    if (name === "车") {
        return car(chess, x, y);
    }
    return false;
}

//小兵的走路方式
function soldier(chess, x, y) {
    if(chess.getColor() === 'red'){
        if (y < 5) {
            chess.checkEnemy(x + 1, y);
            chess.checkEnemy(x - 1, y);
        }
        chess.checkEnemy(x, y - 1);
    } else {
        if(y > 4){
            chess.checkEnemy(x + 1, y);
            chess.checkEnemy(x - 1, y);
        }
        chess.checkEnemy(x, y + 1);
    }
}

//车的走路方式
function car(chess, x, y) {
    for (let i = y - 1; i > -1; i--) {
        if (chess.checkEnemy(x, i)) {
            break;
        }
    }
    for (let i = y + 1; i < rowsNumbers; i++) {
        if (chess.checkEnemy(x, i)) {
            break;
        }
    }
    for (let i = x - 1; i > -1; i--) {
        if (chess.checkEnemy(i, y)) {
            break;
        }
    }
    for (let i = x + 1; i < columnsNumber; i++) {
        if (chess.checkEnemy(i, y)) {
            break;
        }
    }
}


//将的走路方式
function leader(chess, x, y) {

    if(chess.getColor() === 'red'){
        for (let i = y - 1; i < y + 2; i++) {
            for (let j = x - 1; j < x + 2; j++) {
                chess.checkEnemy(j, i);
            }
        }
    } else {
        for (let i = y + 1; i > y - 2; i--) {
            for (let j = x - 1; j < x + 2; j++) {
                chess.checkEnemy(j, i);
            }
        }
    }
}

//检查是否将军
function checkLeader(x, y, chess){
    if(chess.getColor() === 'red'){
        for (let i = y; i < -1; i--) {
            if(!chess.checkEnemy(x, i)){
                clearPoint(x, i);
            } else {
                chess.checkEnemy(x, i);
            }
        }
    } else {
        for (let i = y; i < rowsNumbers; i++) {
            if(!chess.checkEnemy(x, i)){
                clearPoint(x, i);
            } else {
                chess.checkEnemy(x, i);
            }
        }
    }
    return true;
}

//士的走路方式
function keeper(chess, x, y) {
    if(chess.getColor() === 'red'){
        if(x > 3 && x < 5 && y > 7){
            if(y < rowsNumbers-1){
                chess.checkEnemy(x + 1, y + 1);
                chess.checkEnemy(x - 1, y + 1);
            }
            chess.checkEnemy(x + 1, y - 1);
            chess.checkEnemy(x - 1, y - 1);
        } else if(x === 3 && y > 7){
            if(y > rowsNumbers-1){
                chess.checkEnemy(x + 1, y + 1);
            }
            chess.checkEnemy(x + 1, y - 1);
        } else if(x === 5 && y > 7){
            chess.checkEnemy(x - 1, y - 1);
            if(y > rowsNumbers-1){
                chess.checkEnemy(x - 1, y + 1);
            }
        } else if(x === 3 && y === 7){
            chess.checkEnemy(x + 1, y + 1);
        } else if(x === 5 && y === 7){
            chess.checkEnemy(x - 1, y + 1);
        }
    } else {
        if(x > 3 && x < 5 && y < 2){
            chess.checkEnemy(x + 1, y + 1);
            chess.checkEnemy(x - 1, y + 1);
            if(y > 0){
                chess.checkEnemy(x + 1, y - 1);
                chess.checkEnemy(x - 1, y - 1);
            }
        } else if(x === 3 && y < 2){
            chess.checkEnemy(x + 1, y + 1);
            if(y > 0){
                chess.checkEnemy(x + 1, y - 1);
            }
        } else if(x === 5 && y < 2){
            if(y > 0){
                chess.checkEnemy(x - 1, y - 1);
            }
            chess.checkEnemy(x - 1, y + 1);
        } else if(x === 3 && y === 2){
            chess.checkEnemy(x + 1, y - 1);
        } else if(x === 5 && y === 2){
            chess.checkEnemy(x - 1, y - 1);
        }
    }
}

//炮的重复片段
function canonRepeatForY(def, range, chess, x, y){
    let count = 1;
    let type = null;

    if(def < y){
        for (let i = def; i > -1;  i--) {
            if (chess.checkEnemy(x, i)) {
                if (count >= 2) {
                    break;
                }
                type = chessList[i][x];
                chessList[i][x].setTarget(false);
                chessList[i][x].divElement.style.backgroundColor = "#ebd588";
                count++;
            }
            if (type !== null) {
                clearPoint(x, i);
            }
        }
    } else {
        for (let i = def; i < range;  i++) {
            if (chess.checkEnemy(x, i)) {
                if (count >= 2) {
                    break;
                }
                type = chessList[i][x];
                chessList[i][x].setTarget(false);
                chessList[i][x].divElement.style.backgroundColor = "#ebd588";
                count++;
            }
            if (type !== null) {
                clearPoint(x, i);
            }
        }
    }
}
function canonRepeatForX(def, range, chess, x, y){
    let count = 1;
    let type = null;

    if(def < x){
        for (let i = def; i > -1;  i--) {
            if (chess.checkEnemy(i, y)) {
                if (count >= 2) {
                    break;
                }
                type = chessList[y][i];
                chessList[y][i].setTarget(false);
                chessList[y][i].divElement.style.backgroundColor = "#ebd588";
                count++;
            }
            if (type !== null) {
                clearPoint(i, y);
            }
        }
    } else {
        for (let i = def; i < range;  i++) {
            if (chess.checkEnemy(i, y)) {
                if (count >= 2) {
                    break;
                }
                type = chessList[y][i];
                chessList[y][i].setTarget(false);
                chessList[y][i].divElement.style.backgroundColor = "#ebd588";
                count++;
            }
            if (type !== null) {
                clearPoint(i, y);
            }
        }
    }
}
//炮的走路方式
function canon(chess, x, y) {
    canonRepeatForY(y - 1, -1, chess, x, y);
    canonRepeatForY(y + 1, rowsNumbers, chess, x, y);
    canonRepeatForX(x - 1,  -1, chess, x, y);
    canonRepeatForX(x + 1, columnsNumber, chess, x, y);
}

//象的走路方式
function elephant(chess, x, y) {

    if(chess.getColor() === 'red'){
        if (y - 2 >= 5) {
            chess.checkEnemy(x - 2, y - 2);
            chess.checkEnemy(x + 2, y - 2);
        }
        chess.checkEnemy(x - 2, y + 2);
        chess.checkEnemy(x + 2, y + 2);
    } else {
        if(y + 2 <= 4){
            chess.checkEnemy(x - 2, y + 2);
            chess.checkEnemy(x + 2, y + 2);
        }
        chess.checkEnemy(x - 2, y - 2);
        chess.checkEnemy(x + 2, y - 2);
    }
}

//马的走路方式
function horse(chess, x, y) {
    let judgeChess = false; //用于判断是否有出现压马腿现象


    //正上方两个日字
    for (let i = x; i >= x - 1; i--) {
        if (judgeChess) {
            break;
        }
        for (let j = y - 1; j >= y - 2; j--) {
            if (isExist(i, j)) {
                judgeChess = true;
                break;
            } else if (i === x - 1 && j === y - 2) {
                chess.checkEnemy(i, j);
            }
        }
    }
    judgeChess = false;
    for (let i = x; i <= x + 1; i++) {
        if (judgeChess) {
            break;
        }
        for (let j = y - 1; j >= y - 2; j--) {
            if (isExist(i, j)) {
                judgeChess = true;
                break;
            } else if (i === x + 1 && j === y - 2) {
                chess.checkEnemy(i, j);
            }
        }
    }
    judgeChess = false;
    //右边两个日字
    for (let i = x + 1; i <= x + 2; i++) {
        if (judgeChess) {
            break;
        }
        for (let j = y; j <= y + 1; j++) {
            if (isExist(i, j)) {
                judgeChess = true;
                break;
            } else if (j === y + 1 && i === x + 2) {
                chess.checkEnemy(i, j);
            }
        }
    }
    judgeChess = false;
    for (let i = x + 1; i <= x + 2; i++) {
        if (judgeChess) {
            break;
        }
        for (let j = y; j >= y - 1; j--) {
            if (isExist(i, j)) {
                judgeChess = true;
                break;
            } else if (j === y - 1 && i === x + 2) {
                chess.checkEnemy(i, j);
            }
        }
    }
    judgeChess = false;
    //正下方两个日字
    for (let i = x; i <= x + 1; i++) {
        if (judgeChess) {
            break;
        }
        for (let j = y + 1; j <= y + 2; j++) {
            if (isExist(i, j)) {
                judgeChess = true;
                break;
            } else if (i === x + 1 && j === y + 2) {
                chess.checkEnemy(i, j);
            }
        }
    }
    judgeChess = false;
    for (let i = x; i >= x - 1; i--) {
        if (judgeChess) {
            break;
        }
        for (let j = y + 1; j <= y + 2; j++) {
            if (isExist(i, j)) {
                judgeChess = true;
                break;
            } else if (i === x - 1 && j === y + 2) {
                chess.checkEnemy(i, j);
            }
        }
    }
    judgeChess = false;
    //左边的两个日字
    for (let j = x - 1; j >= x - 2; j--) {
        if (judgeChess) {
            break;
        }
        for (let i = y; i >= y - 1; i--) {
            if (isExist(j, i)) {
                judgeChess = true;
                break;
            } else if (j === x - 2 && i === y - 1) {
                chess.checkEnemy(j, i);
            }
        }
    }
    judgeChess = false;
    for (let j = x - 1; j >= x - 2; j--) {
        if (judgeChess) {
            break;
        }
        for (let i = y; i <= y + 1; i++) {
            if (isExist(j, i)) {
                judgeChess = true;
                break;
            } else if (j === x - 2 && i === y + 1) {
                chess.checkEnemy(j, i);
            }
        }
    }
}
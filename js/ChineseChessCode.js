const piecesWrapper = document.getElementById('pieces-wrapper');

//所有棋子的class
class Piece {
    constructor(pieceName, xSet, ySet, color) {
        this.pieceName = pieceName;
        this.xSet = xSet;
        this.ySet = ySet;
        this.color = color;
        this.isTargeted = false;
        this.createPiece();
    }

    isTarget() {
        return this.isTargeted;
    }

    // 把修改背景颜色合并到这个方法里
    setTarget(isTarget) {
        isTarget ? this.divElement.style.backgroundColor = "#a52a2a" : this.divElement.style.backgroundColor = "#ebd588";
        this.isTargeted = isTarget;
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

    getPieceName() {
        return this.pieceName;
    }

    setX(x) {
        this.xSet = x;
    }

    setY(y) {
        this.ySet = y;
    }

    getDivElement() {
        return this.divElement;
    }

    eaten() {
        this.divElement.style.display = "none";
    }

    isGeneralPiece() {
        return this.pieceName === "将" || this.pieceName === "帅";
    }

    //画棋子
    createPiece() {
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
        div.innerHTML = "<div class='piece-name'>" + this.pieceName + " </div>";

        div.addEventListener('click', function () {
            const x = Math.round(div.offsetLeft / 50);
            const y = Math.round(div.offsetTop / 50);

            if (!hasPiece(x, y)) {
                return;
            }
            let piece = pieceList[y][x];
            if (!isColorTurn(div.style.color)) {
                if (isSelected()) {
                    //用于表示棋子吃掉对方的操作
                    if (piece.isTarget()) {
                        if (moveSelectedPieceTo(x, y)) {
                            piece.eaten();
                            nextTurn();
                        }
                    }
                }
                return;
            }
            if (isSelected()) {
                clearPreview();
                selectedPieceElement.getDivElement().style.backgroundColor = "#ebd588";
            }
            if (selectedPieceElement === piece) {
                selectedPieceElement = null;
            } else {
                div.style.backgroundColor = "peru";
                selectedPieceElement = piece;
                foreachPointsCanPlace(piece, (x, y) => drawPreview(x, y));
            }
        });
        this.divElement = div;
        piecesWrapper.appendChild(div);
    }
}


const rowsNumbers = 10;  //棋盘高度
const columnsNumber = 9; //棋盘宽度
const spacing = 50; //spacing: 间距
const board = document.getElementById("board"); // 获取棋盘 canvas 元素
let context = board.getContext('2d'); // 获取棋盘 canvas 上下文
// Piece List: 0 refer to empty, 1 refer to preview piece, Piece object refer to real piece
let pieceList = new Array(rowsNumbers);
let turn = "red"; //确认当前回合
let selectedPieceElement = null; // 存储选中棋子元素

function isSelected() {
    return selectedPieceElement !== null;
}

//初始化棋盘数组
for (let i = 0; i < rowsNumbers; i++) {
    pieceList[i] = new Array(columnsNumber);
    for (let j = 0; j < columnsNumber; j++) {
        pieceList[i][j] = 0;
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
pieceList[9][8] = new Piece("车", 8, 9, "red");
pieceList[9][0] = new Piece("车", 0, 9, "red");
pieceList[0][8] = new Piece("车", 8, 0, "black");
pieceList[0][0] = new Piece("车", 0, 0, "black");

pieceList[9][7] = new Piece("马", 7, 9, "red");
pieceList[9][1] = new Piece("马", 1, 9, "red");
pieceList[0][7] = new Piece("马", 7, 0, "black");
pieceList[0][1] = new Piece("马", 1, 0, "black");

pieceList[9][6] = new Piece("相", 6, 9, "red");
pieceList[9][2] = new Piece("相", 2, 9, "red");
pieceList[0][6] = new Piece("象", 6, 0, "black");
pieceList[0][2] = new Piece("象", 2, 0, "black");

pieceList[9][5] = new Piece("仕", 5, 9, "red");
pieceList[9][3] = new Piece("仕", 3, 9, "red");
pieceList[0][5] = new Piece("士", 5, 0, "black");
pieceList[0][3] = new Piece("士", 3, 0, "black");

pieceList[7][7] = new Piece("炮", 7, 7, "red");
pieceList[7][1] = new Piece("炮", 1, 7, "red");
pieceList[2][7] = new Piece("炮", 7, 2, "black");
pieceList[2][1] = new Piece("炮", 1, 2, "black");

let redLeader = pieceList[9][4] = new Piece("帅", 4, 9, "red");
let blackLeader = pieceList[0][4] = new Piece("将", 4, 0, "black");


for (let i = 0; i < 9; i += 2) {
    pieceList[6][i] = new Piece("兵", i, 6, "red");
    pieceList[3][i] = new Piece("卒", i, 3, "black");
}

// 判断棋盘上面的这个点是否有棋子
function hasPiece(x, y) {
    return isLegal(x, y) && pieceList[y][x] !== 0 && pieceList[y][x] !== 1;
}

// 判断这个点是否什么都没有
function isEmpty(x, y) {
    return isLegal(x, y) && (pieceList[y][x] === 0 || pieceList[y][x] === 1);
}

function isLegal(x, y) {
    return x >= 0 && x < columnsNumber && y >= 0 && y < rowsNumbers;
}

function getPiece(x, y) {
    return isLegal(x, y) ? pieceList[y][x] : 0;
}

/**
 * @param {number} x x坐标
 * @param {number} y y坐标
 * @param {function} callback 回调函数
 */
function doIfHasPiece(x, y, callback) {
    if (hasPiece(x, y)) {
        callback(getPiece(x, y));
    }
}

//下一个回合，棋盘和数组进行翻转
function nextTurn() {
    turn = turn === "red" ? "black" : "red";
    selectedPieceElement = null;
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
    let piece = getPiece(x, y);

    if (piece === 0) {
        drawPoint(x, y)
        return; // false
    }
    if (!isColorTurn(piece.getColor())) {
        piece.setTarget(true);
    }
}

//判断所点击的棋子是否是我方棋子
function isColorTurn(color) {
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
    pieceList[y][x] = 1;
}

//清除画出来的点
function clearPoint(x, y) {
    previewCtx.clearRect(x * spacing, y * spacing, spacing, spacing);
}

//判断棋子的颜色是否正常
function isCorrectColor(piece) {
    return piece.divElement.style.backgroundColor !== "#ebd588";
}


previewPoints.addEventListener('click', function (e) {
    const x = Math.round((e.offsetX - spacing / 2) / spacing);
    const y = Math.round((e.offsetY - spacing / 2) / spacing);

    if (getPiece(x, y) === 1 && selectedPieceElement !== null) {
        if (moveSelectedPieceTo(x, y)) {
            nextTurn();
        }
    }
})

/**
 * 移动选中的棋子到指定的位置
 * @param x 新的x坐标
 * @param y 新的y坐标
 * @return {boolean} 操作成功或失败
 */
function moveSelectedPieceTo(x, y) {
    // 先移动数据层面，不渲染到棋盘
    let prevX = selectedPieceElement.getX();
    let prevY = selectedPieceElement.getY();
    let prevPiece = pieceList[x][y];
    clearPreview();
    pieceList[prevY][prevX] = 0;
    selectedPieceElement.setX(x);
    selectedPieceElement.setY(y);
    pieceList[y][x] = selectedPieceElement;
    // 检测如果移动后是否将军
    if (!beforeMoveCheck(x, y)) {
        if(willKillLeaderAnyway()) return ending();
        pieceList[y][x] = prevPiece;
        selectedPieceElement.setX(prevX);
        selectedPieceElement.setY(prevY);
        pieceList[prevY][prevX] = selectedPieceElement;
        selectedPieceElement = null;
        return false;
    } else {
        willKillLeaderPiece.length = 0;
        let style = selectedPieceElement.getDivElement().style;
        style.transitionDuration = ".5s";
        style.zIndex = "10";
        setTimeout(() => style.zIndex = "1", 1000)
        style.left = x * 50 + 5 + 'px';
        style.top = y * 50 + 5 + 'px';
        return true;
    }
}

let willKillLeaderPiece = [];

/**
 * 判断是否绝杀
 * @returns {boolean}
 */
function willKillLeaderAnyway(){
    //TODO 先判断leader除了本身位置以外，是否有可以移动且不会被再次将军的位置
    //TODO 再判断将军的那颗棋子是否会被我放的棋子干扰或者直接吃掉，且干扰过后不会形成再次将军。就是绝杀
    // TODO 可能需要多次遍历棋盘
    // 获取了将、帅当前的位置
    let x = turn === 'red'? redLeader.getX() : blackLeader.getX();
    let y = turn === 'red'? redLeader.getY() : blackLeader.getY();

    return false;
}

/**
 *
 * @param x 新的x坐标
 * @param y 新的y坐标
 * @return {boolean} 是否可以移动
 */
function beforeMoveCheck(x, y) {
    let canMove = true;

    for (let i = 0; i < pieceList.length; i++) {
        for (let j = 0; j < pieceList[i].length; j++) {
            doIfHasPiece(j, i, function (eachPiece) {
                foreachPointsCanPlace(eachPiece, function (x, y) {
                    doIfHasPiece(x, y, function (piece) {
                        if (piece.isGeneralPiece() && eachPiece.getColor() !== piece.getColor()) {
                            if (piece.getColor() === turn) {
                                alert("不可走");
                                canMove = false;
                            }else {
                                piece.setTarget(true);
                                willKillLeaderPiece.push(eachPiece);
                            }
                        }
                    })
                });
            });
        }
    }
    if(checkGeneral()){
        alert("不可走");
        canMove = false;
    }
    return canMove;
}

//清除所有之前画的点，在用完成移动棋子之后。
function clearPreview() {
    for (let i = 0; i < rowsNumbers; i++) {
        for (let j = 0; j < columnsNumber; j++) {
            if (hasPiece(j, i)) {
                if (isCorrectColor(getPiece(j, i))) {
                    getPiece(j, i).setTarget(false);
                    continue;
                }
            }
            if (getPiece(j, i) === 1) {
                clearPoint(j, i);
                pieceList[i][j] = 0;
            }
        }
    }
}

/**
 * 当棋子被点击时触发
 * @param {Piece} piece
 * @param {function} callback
 * @returns {void}
 */
function foreachPointsCanPlace(piece, callback) {
    let name = piece.getPieceName();
    /**
     * @type {function}
     */
    let func = null;
    switch (name) {
        case "兵":
        case "卒":
            func = foreachPointsSoldierCanPlace;
            break;
        case "将":
        case "帅":
            func = foreachPointsGeneralCanPlace;
            break;
        case "炮":
            func = foreachPointsCannonCanPlace;
            break;
        case "士":
        case "仕":
            func = foreachPointsAdvisorCanPlace;
            break;
        case "象":
        case "相":
            func = foreachPointsElephantCanPlace;
            break;
        case "马":
            func = foreachPointsHorseCanPlace;
            break;
        case "车":
            func = foreachPointsChariotCanPlace;
            break;
        default:
            return;
    }
    func(piece, callback);
}

//小兵的走路方式
function foreachPointsSoldierCanPlace(piece, callback) {
    let x = piece.getX();
    let y = piece.getY();
    if (piece.getColor() === "red") {
        if (y < 5) {
            callback(x + 1, y);
            callback(x - 1, y);
        }
        callback(x, y - 1);
    } else {
        if (y > 4) {
            callback(x + 1, y);
            callback(x - 1, y);
        }
        callback(x, y + 1);
    }
}

//车的走路方式
function foreachPointsChariotCanPlace(piece, callback) {
    function repeat(getNext) {
        let next = getNext(piece.getX(), piece.getY());
        while (true) {
            callback(next.x, next.y);
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
function foreachPointsGeneralCanPlace(piece, callback) {
    let x = piece.getX();
    let y = piece.getY();

    function repeat(x, y) {
        if (isInPalace(x, y)) {
            callback(x, y);
        }
    }

    repeat(x + 1, y);
    repeat(x - 1, y);
    repeat(x, y + 1);
    repeat(x, y - 1);
}

//士的走路方式
function foreachPointsAdvisorCanPlace(piece, callback) {
    let x = piece.getX();
    let y = piece.getY();

    function repeat(x, y) {
        if (isInPalace(x, y)) {
            callback(x, y);
        }
    }

    repeat(x + 1, y + 1);
    repeat(x + 1, y - 1);
    repeat(x - 1, y + 1);
    repeat(x - 1, y - 1);
}

//炮的走路方式
function foreachPointsCannonCanPlace(piece, callback) {
    let x = piece.getX();
    let y = piece.getY();

    function repeat(getNext) {
        let next = getNext(x, y);
        // 沿着当前方向一直往前，直到碰到棋子或者边界
        while (true) {
            if (!isEmpty(next.x, next.y)) {
                break;
            }
            callback(next.x, next.y);
            next = getNext(next.x, next.y);
        }
        // 如果碰到的是棋子，则可以当做跳板
        if (hasPiece(next.x, next.y) && getPiece(next.x, next.y) !== 0) {
            // 在跳板后继续寻找
            do {
                next = getNext(next.x, next.y);
                // 直到碰到的不是空位为止
            } while (isEmpty(next.x, next.y));
            // 如果碰到的是棋子，且不是自己的棋子，则可以当做目标
            if (hasPiece(next.x, next.y) && getPiece(next.x, next.y).getColor() !== piece.getColor()) {
                callback(next.x, next.y);
            }
        }
    }

    repeat((x1, y1) => ({x: x1 + 1, y: y1}));
    repeat((x1, y1) => ({x: x1 - 1, y: y1}));
    repeat((x1, y1) => ({x: x1, y: y1 + 1}));
    repeat((x1, y1) => ({x: x1, y: y1 - 1}));
}

//象的走路方式
function foreachPointsElephantCanPlace(piece, callback) {
    let x = piece.getX();
    let y = piece.getY();

    function repeat(offsetX, offsetY) {
        if (getPiece(x + offsetX / 2, y + offsetY / 2) === 0) {
            callback(x + offsetX, y + offsetY);
        }
    }

    if (piece.getColor() === "red") {
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
function foreachPointsHorseCanPlace(piece, callback) {
    let x = piece.getX();
    let y = piece.getY();

    function repeat(offsetX, offsetY, offsetX2, offsetY2) {
        if (hasPiece(x + offsetX2, y + offsetY2)) {
            return;
        }
        if (getPiece(x + offsetX, y + offsetY) === 0) {
            callback(x + offsetX, y + offsetY);
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

//检查双方leader是否撞面
// 应该放到beforeMoveCheck的函数中
function checkGeneral() {
    // TODO
    let y = redLeader.getY() - 1;
    let x = redLeader.getX();

    do {
        let type = pieceList[y][x];
        if (hasPiece(x, y)) {
            if (blackLeader.getPieceName() === type.getPieceName()) {
                return true;
            }
            break;
        }
        y--;
    } while (y >= 0)
    return false;
}

//游戏结束
function ending() {
    alert(turn + " WIN !");
    return false;
}
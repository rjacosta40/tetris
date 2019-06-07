import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let x = 0;
let y = 0;
let aTetrisPieces;
let aCurrentPiece;
let aGameState = createInitialGameState();
let iPieceOrientation = 0;
let bGamePaused = false;
let bGameOver = false;
let iGameScore = 0;

class Square extends React.Component {
    render() {
        return makeSquare(this.props.row, this.props.col);
    }
}

class Board extends React.Component {

    renderSquare(row, col) {
        return <Square row={row} col={col} />;
    }

    render() {
        var squares = [];
        for (let row = 0; row < 20; row++) {       
            for (let col = 0; col < 10; col++) {
                if (aGameState[row][col]) {
                    squares.push(this.renderSquare(row, col));
                }
            }
        }
        
        for (let i = 0; i < aCurrentPiece[iPieceOrientation].squares.length; i++) {
            var square = this.renderSquare(aCurrentPiece[iPieceOrientation].squares[i][0] + y, 
                aCurrentPiece[iPieceOrientation].squares[i][1] + x);
            squares.push(square);
        }
        return (<div>{squares}</div>);
    }
}

class GameText extends React.Component {
    render() {
        var sVisible = 'hidden';
        if (bGameOver || bGamePaused) sVisible = 'visible';
        if (bGameOver) {
            return <div style={
                {
                    textAlign: 'center',
                    paddingLeft: 17 + 'px',
                    paddingTop: 315 + 'px',
                    fontSize: 50 + 'px',
                    visibility: sVisible
                }
            }>GAME OVER</div>
        } else if (bGamePaused) {
            return <div style={
                {
                    textAlign: 'center',
                    paddingLeft: 75 + 'px',
                    paddingTop: 315 + 'px',
                    fontSize: 50 + 'px',
                    visibility: sVisible
                }
            }>PAUSED</div>
        }
        return null;
    }
}

class Game extends React.Component {

    componentDidMount() {
        this.div.focus();
    }
    render() {
        return (
            <div onClick={() => {this.div.focus()}} ref={element => this.div = element} 
                    onKeyDown={handleKeyDown} className="game">
                
                <div className="scoreText">Score: {iGameScore}</div>
                <div className="game-board-wrapper">
                    <div className="game-board">
                        <Board value={aGameState}/>
                        <GameText />
                    </div>
                    <div>
                        <button className="playButton" onClick={playGame}>Play</button>
                        <button className="pauseButton" onClick={pauseGame}>Pause</button>
                  </div>
                </div>
            </div>
        );
    }
}

function pauseGame() {
    bGamePaused = true;
}

function playGame() {
    bGamePaused = false;
}

function timedRender() {
    ReactDOM.render(<Game />, document.getElementById('root'));
    if (!bGamePaused) {
        if (!validMove(aCurrentPiece[iPieceOrientation], x, y + 1)) {
            for (let i = 0; i < aCurrentPiece[iPieceOrientation].squares.length; i++) {
                let currSquare = aCurrentPiece[iPieceOrientation].squares[i];
                aGameState[currSquare[0] + y][currSquare[1] + x] = true;
            }
            y = 0;
            x = 0;
            iPieceOrientation = 0;
            aCurrentPiece = aTetrisPieces[Math.floor((Math.random() * 7))];
            checkForFullRows();
            if (checkForGameOver()) {
                ReactDOM.render(<Game />, document.getElementById('root'));
            }
        } else y++;
    }
    if (!bGameOver) setTimeout(timedRender, 500);
}

function checkForGameOver() {
    aGameState[0].forEach((square) => {
        if (square === true) bGameOver = true;
    });
    return bGameOver;
}

function checkForFullRows() {
    var row = 0;
    while (row < 20) {
        var bRowIsFull = true;
        // eslint-disable-next-line
        aGameState[row].forEach((square) => {
            if (square === false) bRowIsFull = false;
        });
        if (bRowIsFull) {
            aGameState.splice(row, 1);
            aGameState.splice(0, 0, new Array(10));
            aGameState[0].fill(false);
            row--;
            iPieceOrientation = 0;
            iGameScore++;
        }
        row++;
    }
}

function handleKeyDown(event) {
    if (bGamePaused) return;
    if (event.key === "ArrowLeft") {
        if (validMove(aCurrentPiece[iPieceOrientation], x - 1, y)) {
            x--;
        }
    }
    if (event.key === "ArrowRight") {
        if (validMove(aCurrentPiece[iPieceOrientation], x + 1, y)) {
            x++;
        }
    }
    if (event.key === "ArrowDown") {
        if (validMove(aCurrentPiece[iPieceOrientation], x, y + 1)) {
            y++;
        }
    }
    if (event.key === "ArrowUp") {
        iPieceOrientation = aCurrentPiece.length === iPieceOrientation + 1 ? 0 : iPieceOrientation + 1;
        if (!validMove(aCurrentPiece[iPieceOrientation], x, y)) {
            iPieceOrientation--;
            if (iPieceOrientation < 0) iPieceOrientation = 0;
        }
    }
    ReactDOM.render(<Game />, document.getElementById('root'));
}

function validMove(piece, dx, dy) {
    var bValidMove = true;
    piece.squares.forEach((square) => {
        if (square[0] + dy > 19 
            || (square[1] + dx < 0 || square[1] + dx > 9)
            || aGameState[square[0] + dy][square[1] + dx]) {
            bValidMove = false;
        }
    });
    return bValidMove;
}

function makeSquare(row, col) {
    return (
    <button className="square" type="text"
        style={
            {
                top: (row * 34) + 'px',
                left: (col * 34) + 'px'
            }
        } 
    />);
}

function createInitialGameState() {
    var aGameState = new Array(20);
    for (let i = 0; i < 20; i++) {
        aGameState[i] = new Array(10);
        aGameState[i].fill(false);
    }
    aTetrisPieces = createTetrisPieces();
    aCurrentPiece = aTetrisPieces[Math.floor((Math.random() * 7))];
    return aGameState;
}

function createTetrisPieces() {
    return [
        // line
        [
            {
                squares: [
                    [0, 4],
                    [1, 4],
                    [2, 4],
                    [3, 4]
                ],
            },
            {
                squares: [
                    [0, 3],
                    [0, 4],
                    [0, 5],
                    [0, 6]
                ],
            }
        ],
        // lShape
        [
            {
                squares: [
                    [0, 4],
                    [1, 4],
                    [2, 4],
                    [2, 5]
                ],
            },
            {
                squares: [
                    [1, 3],
                    [1, 4],
                    [1, 5],
                    [0, 5]
                ],
            },
            {
                squares: [
                    [0, 3],
                    [0, 4],
                    [1, 4],
                    [2, 4],
                ],
            },
            {
                squares: [
                    [1, 3],
                    [1, 4],
                    [1, 5],
                    [2, 3]
                ],
            }            
        ],
        // jShape
        [
            {
                squares: [
                    [0, 4],
                    [1, 4],
                    [2, 4],
                    [2, 3]
                ],
            },
            {
                squares: [
                    [1, 3],
                    [1, 4],
                    [1, 5],
                    [2, 5]
                ],
            },
            {
                squares: [
                    [0, 5],
                    [0, 4],
                    [1, 4],
                    [2, 4],
                ],
            },
            {
                squares: [
                    [1, 3],
                    [1, 4],
                    [1, 5],
                    [0, 3]
                ],
            } 
        ],
        // square
        [
            {
                squares: [
                    [0, 4],
                    [1, 4],
                    [1, 5],
                    [0, 5]
                ],
            } 
        ],
        // sShape
        [
            {
                squares: [
                    [0, 4],
                    [1, 4],
                    [1, 3],
                    [0, 5]
                ],
            },
            {
                squares: [
                    [1, 3],
                    [1, 4],
                    [2, 4],
                    [0, 3]
                ],
            }
        ],
        // zShape
        [
            {
                squares: [
                    [0, 4],
                    [1, 4],
                    [1, 5],
                    [0, 3]
                ],
            },
            {
                squares: [
                    [1, 3],
                    [1, 4],
                    [0, 4],
                    [2, 3]
                ],
            }
        ],
        // tShape
        [
            {
                squares: [
                    [0, 4],
                    [1, 4],
                    [1, 5],
                    [1, 3]
                ],
            },
            {
                squares: [
                    [1, 3],
                    [1, 4],
                    [0, 4],
                    [2, 4]
                ],
            },
            {
                squares: [
                    [2, 4],
                    [1, 4],
                    [1, 5],
                    [1, 3]
                ],
            },
            {
                squares: [
                    [1, 5],
                    [1, 4],
                    [0, 4],
                    [2, 4]
                ],
            }
        ]
    ];
}

timedRender();

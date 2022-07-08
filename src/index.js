import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className={props.class} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                class={this.props.point.includes(i)?"square gold" : "square"}
            />
        );
    }

    render() {
        // 采用循环生成九宫格
        const boardLine = [1, 2, 3].map((item, itemIndex) => {
            return (
                <div className="board-row" key={itemIndex}>
                    {[1, 2, 3].map((numbers, numIndex) => this.renderSquare(item * 3 - (3 - numbers) - 1))}
                </div>
            );
        });
        return (
            <div>
                {boardLine}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            currentPoint: [],
            isHistoryAsc:true

        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares)?.winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            currentPoint: this.state.currentPoint.concat(i),
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    // 切换升序降序
    changeOrder() {
        this.setState((state)=>({ isHistoryAsc:!this.state.isHistoryAsc }));
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerResult = calculateWinner(current.squares);
        const  winner = winnerResult?.winner;

        const moves = history.map((step, move) => {
            move=this.state.isHistoryAsc?move:this.state.history.length - 1 - move
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const  bold=move===history.length-1?<strong>{desc}</strong>:desc;
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{bold}</button>
                    <span>
                        ---------这一步的坐标是({calcRowPoint(this.state.currentPoint[move - 1])[0]},{calcRowPoint(this.state.currentPoint[move - 1])[1]})
                    </span>
                </li>
            );
        });

        let status;
        let tieResult = false;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
        if(current.squares.every((item)=>item)&&!winner){
            tieResult=true;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        point={winnerResult?.point || []}
                    />
                </div>
                <div className="game-info">
                    <div>{status}-----
                        <button onClick={() => {this.changeOrder();}}>
                            历史记录{this.state.isHistoryAsc ? '升序' : '降序'}排列
                        </button>
                    </div>

                    <ol>{moves}</ol>
                </div>
                {tieResult && (
                    <div>
                        <h1>平局</h1>
                    </div>
                )}
            </div>
        );

    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner:squares[a],
                point:[a,b,c]
                }
            }
        }
    return null;
    }
    


function calcRowPoint(point){
    if(point===undefined){
        return ["",""];
    }
    let row=Math.floor(point/3);
    let line=point%3;
    return [line,row];
}
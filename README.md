

## [官网的入门教程小游戏](https://react.docschina.org/tutorial/tutorial.html#picking-a-key)

` 游戏规则，“三子棋”`

###  整体设计

> 其中涉及三个组件，一个函数组件 Square ，两个  React 组件 

Square 负责渲染每个按钮， Board  负责渲染整个方块，Game组件负责整个棋盘。

函数式组件： 如果你想写的组件只包含一个 `render` 方法，并且不包含 state，那么使用**函数组件**就会更简单。 

组件之间通过**Props**传递数据， 一个组件接收一些参数，我们把这些参数叫做 `props`（“props” 是 “properties” 简写） 

用**state**实现数据存储，即“记忆功能”（每个组件的私有属性）， 每次在组件中调用 `setState` 时，React 都会自动更新其子组件 

### 构建空棋盘流程

#### 项目启动时

先进入最顶层的父组件加载构造函数

```js
 //history记录每一步后的棋盘布局。一开始棋盘中全部为null
 //stepNumber表示 哪一项历史记录，即数组history的下标
 //xIsNext表示下一步该谁走，true表示X，false表示O
 constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            stepNumber: 0,
            xIsNext: true
        };
    }
```

#### Game组件render方法进行内容展示

```javascript
render() {
        //将state的history变量取出来
        const history = this.state.history;
        //以一开始为例，stempNumber为0，故取数组history中的第一个，即history[0]
        const current = history[this.state.stepNumber];
        //calculateWinner表示计算谁是获胜者，返回获胜者名称或者null
        const winner = calculateWinner(current.squares);
		//将每次的描述都赋值给moves，多个<li>
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
	    //判读那是否游戏结束，显示相应的信息
        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
		//return里是屏幕上显示的具体内容
        return (
            <div className="game">
                //棋盘信息
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                     />
                </div>
				//游戏进行信息
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
```

#### 进入Board组件render方法

由于Game组件里面使用Board组件。

```javascript
class Board extends React.Component {
    //调用Square组件
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
	
    //调用renderSquare方法
    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}
```

#### 进入Square组件

由于Board组件里面使用Square组件。

```javascript
//接收参数，返回button，button里面的值是prop.value
//也就Board组件里的value=this.props.squares[i]，以i=0为例，
//value的值是由Gama组件squares={current.squares}传递给Board的squares
//Board再取squares的第i个(0个)传递给Square的value，值为null
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
```

#### 构建了一个空的棋盘

### 下棋的时候发生什么

#### 点击棋盘

```javascript
//点击棋盘时候，触发Square的onclick触发器
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

//触发Square的onclick触发器,里面是Board传入的函数onClick，故此时调用Board的onClick
renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    
//同理，Board的onClick里面是Game的handleClick函数
    return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
```

#### 调用handleClick

到这一步就是用户点击一个格子，经过三次传递到了handleClick函数。比如点击的是0方格，0方格的Square触发器检测到，找到Board的renderSquare(0)，在找到handleClick(0) 

```javascript
  handleClick(i) {
      //将history里面所有的下棋记录取出来
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
      //current即当前的棋盘布局
      const current = history[history.length - 1];
      //取出当前棋盘布局备份
        const squares = current.squares.slice();
      //如果此时已经有胜者或者点击了有值的格子，则直接返回
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
      //判断一下点击的格子是X还O并且赋值
        squares[i] = this.state.xIsNext ? "X" : "O";
      //讲此时组件内值重新设计，此时该组件和其子组件会重新刷新
        this.setState({
            //history后加了一天记录
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            //历史长度+1，即当前走的步数+1
            stepNumber: history.length,
            //下一步该谁走变一下
            xIsNext: !this.state.xIsNext
        });
    }

```

#### 重新加载Gama及其子组件

即就是重新构建棋盘，步骤和构建空棋盘差不多，只不过此时squares不是全为null，而是里面有值了。

###  在游戏历史记录列表显示每一步棋的坐标

格式为 (列号, 行号) ,思路是在Game组件中记录每次下棋的位置，类似history一样

```javascript
 //1.构造函数 state属性上 加上currentPoint表示当前下棋的坐标
 currentPoint: []
 //2.每次下棋之后，将当前坐标加上去(数组类型)
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
 //3.render方法中在每个步骤之后，根据currentPoint计算横纵坐标进行显示
  const moves = history.map((step, move) => {
            move=this.state.isHistoryAsc?move:this.state.history.length - 1-move
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
 //4.calcRowPoint为自己定义的，根据数组坐标计算棋盘上横纵坐标的函数
function calcRowPoint(point){
    if(point===undefined){
        return ["",""];
    }
    let row=Math.floor(point/3);
    let line=point%3;
    return [line,row];
}
```

###  在历史记录列表中加粗显示当前选择的项目 

就是进行到哪一步，历史记录列表中的哪一项进行加粗

```javascript
//简单的判断一下 当前步骤move是否是历史步骤的最后一个即可
const moves = history.map((step, move) => {
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
```

### 使用两个循环来渲染出棋盘的格子

两个for循环

```javascript
//Board组件中
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
```

### 添加一个可以升序或降序显示历史记录的按钮

```javascript
//总体思路：改变渲染顺序即可
//增加一个button，在Game的render的return结果中
return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
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
//Game的构造函数state中增加属性isHistoryAsc
isHistoryAsc:true
//增加一个改变这个属性的方法
// 切换升序降序
    changeOrder() {
        this.setState((state)=>({ isHistoryAsc:!this.state.isHistoryAsc }));
    }
//显示的时候判断一下
const moves = history.map((step, move) => {
            move=this.state.isHistoryAsc?move:this.state.history.length - 1-move
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
```

###  每当有人获胜时，高亮显示连成一线的 3 颗棋子 

```javascript
//胜利时判断出哪三个棋子，然后进行高亮就行
//修改判断胜利者的返回格式，除了返回谁是胜利者，还要返回坐标
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
//修改之前调用calculateWinner的地方
//Game的render方法
const winnerResult = calculateWinner(current.squares);
        const  winner = winnerResult?.winner;
//Game的handleClick(i) 方法    
 if (calculateWinner(squares)?.winner || squares[i]) {
            return;
        }
//Game传递胜利者坐标 没有则为[]
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
            </div>
        );
//Board进行参数接受
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
```

### 当无人获胜时，显示一个平局的消息。

```
//加上一个判断即可
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

//显示
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
```


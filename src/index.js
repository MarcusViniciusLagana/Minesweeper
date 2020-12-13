import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    let name = 'square';

    if (props.clicked) name = 'clicked ' + name + ' ' + props.clicked;
    //if (props.clicked) name = 'clicked square'

    return (
        <button className={name} onClick={props.clickHandle}>
            {props.value}
        </button>
    );
}

function BoardRow (props) {
    const values = props.values;
    const clicked = props.clicked;
    const size = values.length;
    const squares = [];

    for (let i = 0; i < size; i++) {
        squares.push(<Square value={values[i]} clicked={clicked[i]} clickHandle={() => props.clickHandle(i)}/>);
    }

    return(
        <div className="board-row">
            {squares}
        </div>
    );
}

function Board (props) {
    const size = props.state.size;
    const values = props.state.values;
    const clicked = props.state.clicked;
    const rows = [];

    for (let i = 0; i < size; i++) {
        rows.push(<BoardRow values={values.slice(i * size, i * size + size)} clicked={clicked.slice(i * size, i * size + size)} clickHandle={(j) => props.clickHandle(i * size + j)}/>);
    }

    return (
        <div className="game-board">
            {rows}
        </div>
    );
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        const mines = [];
        const bombs = ['\u2620','\u2622','\u2623'];
        const safe = '\u26A0';

        for (let i=0; i < props.size + 1; i++) {
            const index = Math.floor(Math.random() * props.size ** 2);
            if (!mines.includes(index)) mines.push(index);
        }

        const index = Math.floor(Math.random() * 3);

        this.state = {
            size: props.size,
            values: Array(props.size ** 2).fill(null),
            clicked: Array(props.size ** 2).fill(null),
            symbols: [safe, bombs[index]],
            mines
        };
    }

    restartGame() {
        const mines = [];
        const bombs = ['\u2620','\u2622','\u2623'];
        const safe = '\u26A0';

        for (let i=0; i < this.props.size + 1; i++) {
            const index = Math.floor(Math.random() * this.props.size ** 2);
            if (!mines.includes(index)) mines.push(index);
        }

        const index = Math.floor(Math.random() * 3);

        this.setState({
            size: this.props.size,
            values: Array(this.props.size ** 2).fill(null),
            clicked: Array(this.props.size ** 2).fill(null),
            symbols: [safe, bombs[index]],
            mines
        });
    }

    clickHandle (index) {
        const values = this.state.values;
        const clicked = this.state.clicked;
        const mines = this.state.mines;

        if (clicked[index]) return;

        if (mines.includes(index)) {
            clicked[index] = 'saved-exploded';
            values[index] = this.state.symbols[1];
        } else clicked[index] = 'clicked'

        this.setState({ values, clicked });
    }

    render() {
        return (<div>
            <div className="title">Minesweeper</div>
            <div className="game-info">{'\u2691 \u2B59 \u26A0 \u2BD1 ? \u2753 \u2620 \u2622 \u2623'}</div>
            <div className="game-area">
                <div className="game">
                    <Board state={this.state} clickHandle={(i) => this.clickHandle(i)}/>
                </div>  
                <div className="restart">
                    <button className="restart-button" onClick={() => this.restartGame()}>Restart Game</button>
                </div>
            </div>
        </div>);
    }
}

ReactDOM.render(
    <Game size={9}/>,
    document.getElementById('root')
);
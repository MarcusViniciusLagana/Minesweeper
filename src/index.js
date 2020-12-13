import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    const name = props.clicked + ' square';
    let value = props.value;

    if (value === 0) value = '';

    //if (props.clicked) name += props.clicked;
    //if (props.clicked) name = 'clicked square'

    return (
        <button className={name} onClick={props.clickHandle}>
            {value}
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

        for (let i=0; i < props.size + 2; i++) {
            const index = Math.floor(Math.random() * props.size ** 2);
            if (!mines.includes(index)) mines.push(index);
        }

        const index = Math.floor(Math.random() * 3);

        this.state = {
            size: props.size,
            values: Array(props.size ** 2).fill(null),
            clicked: Array(props.size ** 2).fill(''),
            symbols: [safe, bombs[index]],
            mines
        };
    }

    restartGame() {
        const mines = [];
        const bombs = ['\u2620','\u2622','\u2623'];
        const safe = '\u26A0';

        for (let i=0; i < this.props.size + 2; i++) {
            const index = Math.floor(Math.random() * this.props.size ** 2);
            if (!mines.includes(index)) mines.push(index);
        }

        const index = Math.floor(Math.random() * 3);

        this.setState({
            size: this.props.size,
            values: Array(this.props.size ** 2).fill(null),
            clicked: Array(this.props.size ** 2).fill(''),
            symbols: [safe, bombs[index]],
            mines
        });
    }

    clickHandle (index) {
        const values = this.state.values;
        const clicked = this.state.clicked;
        const mines = this.state.mines;
        let positions = [];

        if (clicked[index]) return;

        if (mines.includes(index)) {
            clicked[index] = 'clicked saved-exploded';
            values[index] = this.state.symbols[1];
        } else [values[index], clicked[index], positions] = this.countBombs(index, this.state.size, mines);

        this.setState({ values, clicked });

        if (values[index] === 0) {
            for (const i of positions) this.clickHandle(i);
        }

    }

    countBombs (index, size, mines) {
        const words = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
        let positions = [index - size - 1, index - size, index - size + 1, index - 1, index + 1, index + size -1, index + size, index + size + 1];
        const borderA = [];
        const borderB = [];
        let border = [];
        const indexes = [];

        // Which indexes are at the borders
        for (let i=0; i < size; i++) {
            borderA.push(i * size);
            borderB.push(i * size + size - 1);
        }
        // If the index is in one of the borders, we don't want to count
        // bombs that are in the other border
        if (borderA.includes(index)) border = borderB;
        if (borderB.includes(index)) border = borderA;

        // Find itens that are above or below the board
        // and itens that are in the other border
        for (let i=0; i < 8; i++) {
            if (positions[i] < 0) indexes.push(i);
            else if (border.includes(positions[i])) indexes.push(i);
            else if (positions[i] > size ** 2 - 1) indexes.push(i);
        }
        // Remove indexes that we don't want to count bombs
        for (const i of indexes) {
            positions.splice(i, 1, '');
        }
        positions = positions.filter(x => x);

        // Count bombs in adjacent squares
        let bombs = 0;
        for (const i of positions) if (mines.includes(i)) bombs++;

        return([bombs, 'clicked ' + words[bombs], positions])
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
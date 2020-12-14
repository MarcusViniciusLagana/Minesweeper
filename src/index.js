import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    const name = props.state.clicked + ' square';
    let value = props.state.value;
    const clickHandle = (mouse) => props.clickHandle(mouse);

    return (
        <button className={name} onClick={clickHandle} onContextMenu={clickHandle}>
            {value}
        </button>
    );
}

function BoardRow (props) {
    const size = props.state.size;
    const squares = [];

    for (let i = 0; i < size; i++) {
        const value = props.state.values[i];
        const clicked = props.state.clicked[i];
        const state = {value, clicked};
        const clickHandle = (mouse) => props.clickHandle(mouse, i);
        squares.push(<Square state={state} clickHandle={clickHandle}/>);
    }

    return(
        <div className="board-row">
            {squares}
        </div>
    );
}

function Board (props) {
    const size = props.state.size;

    const rows = [];

    for (let i = 0; i < size; i++) {
        const values = props.state.values.slice(i * size, i * size + size);
        const clicked = props.state.clicked.slice(i * size, i * size + size);
        const state = {values, clicked, size};
        const clickHandle = (mouse, j) => props.clickHandle(mouse, i * size + j);
        rows.push(<BoardRow state={state} clickHandle={clickHandle}/>);
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
        const size = props.size;

        for (let i=0; i < size + 1; i++) {
            const index = Math.floor(Math.random() * size ** 2);
            if (!mines.includes(index)) mines.push(index);
            else i--;
        }

        const index = Math.floor(Math.random() * 3);

        this.state = {
            values: Array(size ** 2).fill(null),
            clicked: Array(size ** 2).fill(''),
            bomb: bombs[index],
            size,
            mines
        };
    }

    restartGame() {
        const mines = [];
        const bombs = ['\u2620','\u2622','\u2623'];

        for (let i=0; i < this.props.size + 2; i++) {
            const index = Math.floor(Math.random() * this.props.size ** 2);
            if (!mines.includes(index)) mines.push(index);
            else i--;
        }

        const index = Math.floor(Math.random() * 3);

        this.setState({
            values: Array(this.props.size ** 2).fill(null),
            clicked: Array(this.props.size ** 2).fill(''),
            bomb: bombs[index],
            mines
        });
    }

    clickHandle (mouse, index) {
        const values = this.state.values;
        const clicked = this.state.clicked;
        const mines = this.state.mines;
        const symbols = [null, '\u2691', '?', null];
        let positions = [];

        if (mouse.button === 0) {
            if (clicked[index]) return;

            if (mines.includes(index)) {
                clicked[index] = 'clicked red';
                values[index] = this.state.bomb;
                // Lógica de detonar as bombas
            } else {
                [values[index], clicked[index], positions] = this.countBombs(index);
                if (values[index] === 0) values[index] = '';
            }
        } else if (mouse.button === 2) {
            mouse.preventDefault()
            if (clicked[index] && clicked[index] !== 'blue') return;

            const i = symbols.indexOf(values[index]) + 1;
            values[index] = symbols[i];
            if (i === 1) clicked[index] = 'blue';
            else clicked[index] = '';
        }

        this.setState({ values, clicked });

        if (mouse.button === 0 && !values[index]) {
            for (const i of positions) this.clickHandle(mouse, i);
        }
    }

    countBombs (index) {
        const size = this.state.size;
        const mines = this.state.mines;
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
        positions = positions.filter(x => x !== '');

        // Count bombs in adjacent squares
        let bombs = 0;
        for (const i of positions) if (mines.includes(i)) bombs++;

        return([bombs, 'clicked ' + words[bombs], positions])
    }

    render() {
        const mines = this.state.mines;
        const clicked = this.state.clicked;
        const bombs = mines.length - clicked.length + clicked.filter(x => x !== 'blue').length;

        return (<div>
            <div className="title">Minesweeper</div>
            <div className="game-area">
                <Menu bombs={bombs}/>
                <div className="game">
                    <Board state={this.state} clickHandle={(mouse, i) => this.clickHandle(mouse, i)}/>
                </div>  
                <div className="restart">
                    <button className="restart-button" onClick={() => this.restartGame()}>Restart Game</button>
                </div>
            </div>
        </div>);
    }
}

function Menu (props) {
    return (
        <div className="game-info game">
            <div className="bombs-time">
                {zeroFill(props.bombs,3)}
            </div>
            <div className="level">
                B
            </div>
            <div className="bombs-time">
                {zeroFill(120,3)}
            </div>
        </div>
    );
}

function zeroFill( number, width ) {
    let sign = '';

    if (number < 0) {
        number *= -1;
        sign = '-';
    }

    width -= number.toString().length - 1;
    if ( width > 0 )
        return sign + new Array(width).join('0') + number;
    return sign + number + "";
}

ReactDOM.render(
    <Game size={9}/>,
    document.getElementById('root')
);
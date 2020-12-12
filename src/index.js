import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    return (
        <button className="square" onClick={props.click}>
            {props.value}
        </button>
    );
}

function BoardRow (props) {
    const squares = [];

    for (const item of props.value) {
        squares.push(<Square value={item}/>);
    }

    return(
        <div className="board-row">
            {squares}
        </div>
    );
}

function Board (props) {
    const rows = [];

    for (let i = 0; i < props.size; i++) {
        rows.push(<BoardRow value={props.value.slice(i * props.size, i * props.size + props.size)}/>);
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
        this.state = {
            nextMove: 'X',
            squares: Array(props.size * props.size).fill(null)
        };
    }

    restartGame() {
        this.setState({
            nextMove: 'X',
            squares: Array(this.props.size * this.props.size).fill(null)
        });
    }

    render() {
        return (<div>
            <div className="title">Minesweeper</div>
            <div className="game-info">Info</div>
            <div className="game-area">
                <div className="game">
                    <Board value={this.state.squares} size={this.props.size}/>
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
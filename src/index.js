import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    let name = 'square';

    if (props.clicked) name = 'clicked square'

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
        this.state = {
            size: props.size,
            values: Array(props.size ** 2).fill(null),
            clicked: Array(props.size ** 2).fill(false),
            mines: Array(props.size + 1).fill(Math.floor(Math.random() * props.size ** 2))
        };
    }

    restartGame() {
        this.setState({
            size: this.props.size,
            values: Array(this.props.size ** 2).fill(null),
            clicked: Array(this.props.size ** 2).fill(false),
            mines: Array(this.props.size + 1).fill(Math.floor(Math.random() * this.props.size ** 2))
        }); 
    }

    clickHandle (index) {
        //const values = this.state.values;
        const clicked = this.state.clicked;

        if (clicked[index]) return;

        clicked[index] = true;
        console.log(index);

        this.setState({ clicked });
    }

    render() {
        return (<div>
            <div className="title">Minesweeper</div>
            <div className="game-info">Info</div>
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
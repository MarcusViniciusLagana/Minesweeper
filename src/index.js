import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    const cssClass = props.state.cssClass + ' square';
    let value = props.state.value;
    const clickHandle = (mouse) => props.clickHandle(mouse);
    const contextHandle = (mouse) => {mouse.preventDefault(); props.clickHandle(mouse);}

    return (
        <button className={cssClass} onClick={clickHandle} onContextMenu={contextHandle}>
            {value}
        </button>
    );
}

function BoardRow (props) {
    const size = props.state.size;
    const squares = Array(size);

    for (let i = 0; i < squares.length; i++) {
        const value = props.state.values[i];
        const cssClass = props.state.cssClass[i];
        const state = {value, cssClass};
        const clickHandle = (mouse) => props.clickHandle(mouse, i);
        squares[i] = <Square state={state} clickHandle={clickHandle}/>;
    }

    return(
        <div className="board-row">
            {squares}
        </div>
    );
}

function Board (props) {
    const size = props.state.size;

    const rows = Array(size);

    for (let i = 0; i < rows.length; i++) {
        const values = props.state.values.slice(i * size, i * size + size);
        const cssClass = props.state.cssClass.slice(i * size, i * size + size);
        const state = {values, cssClass, size};
        const clickHandle = (mouse, j) => props.clickHandle(mouse, i * size + j);
        rows[i] = <BoardRow state={state} clickHandle={clickHandle}/>;
    }

    return (
        <div className="game-board">
            {rows}
        </div>
    );
}

function GameInfo (props) {
    return (
        <div className="game-info game">
            <div className="bombs-time">
                <p>{Zerofill(props.bombs,3)}</p>
            </div>
            <div className="game-over">
                <p>{props.msg}</p>
            </div>
            <div className="bombs-time">
                <p>{Zerofill(props.time,3)}</p>
            </div>
        </div>
    );
}

function LevelOption (props) {
    const onChange = (element) => props.levelControl(element);
    const label = props.level[0].toUpperCase() + props.level.slice(1);

    return (
        <div className="input">
            <input type="radio" name="level" id={props.level} value={props.level} checked={props.checked} onChange={onChange}/>
            <label for={props.level}> {label}</label>
        </div>
    );
}

function Menu (props) {
    const levelControl = (element) => props.levelControl(element);
    const levels = ['easy', 'intermediate', 'hard'];
    const radios = Array(levels.length);

    for (let i=0; i < levels.length; i++) {
        radios[i] = <LevelOption level={levels[i]} checked={props.level === levels[i]} levelControl={levelControl}/>
    }

    return (
        <div className="level game">
            {radios}
        </div>
    );
}

class Game extends React.Component {

    static timerID = null;

    constructor (props) {
        super (props);
        const size = props.size;

        // sorting mines positions
        const mines = Array(props.minesNumber);
        for (let i=0; i < mines.length; i++) {
            const index = Math.floor(Math.random() * size ** 2);
            if (!mines.includes(index)) mines[i] = index;
            else i--;
        }

        // sorting bomb symbol
        const bombs = ['\u2620','\u2622','\u2623'];
        const index = Math.floor(Math.random() * bombs.length);

        // setting initial state
        this.state = {
            values: Array(size ** 2).fill(''),
            cssClass: Array(size ** 2).fill(''),
            bomb: bombs[index],
            size,
            mines,
            phase: 'paused',
            initialTime: props.time,
            time: props.time,
            msg: '',
            level: 'easy'
        };
    }

    // when mounting, set timer to null
    componentDidMount () { Game.timerID = null; }

    // when unmouting, reset timer
    componentWillUnmount () { if (Game.timerID) clearInterval(Game.timerID); }

    restartGame (size = null, minesNumber = null) {
        // reseting size
        if (!size) size = this.state.size;
        if (!minesNumber) minesNumber = this.state.mines.length;

        // sorting mines positions
        const mines = Array(minesNumber);
        for (let i=0; i < mines.length; i++) {
            const index = Math.floor(Math.random() * size ** 2);
            if (!mines.includes(index)) mines[i] = index;
            else i--;
        }
        // DEV TEST LINE
        //const mines = [1];

        // resseting timer
        const time = this.state.initialTime;
        if (Game.timerID) clearInterval(Game.timerID);
        Game.timerID = null;

        // sorting new bomb symbol
        const bombs = ['\u2620','\u2622','\u2623'];
        const index = Math.floor(Math.random() * bombs.length);

        // reseting state
        this.setState({
            values: Array(size ** 2).fill(''),
            cssClass: Array(size ** 2).fill(''),
            bomb: bombs[index],
            size,
            mines,
            phase: 'paused',
            time,
            msg: ''
        });
    }

    clickHandle (mouse, index) {
        let values = this.state.values;
        let cssClass = this.state.cssClass;
        let phase = this.state.phase;
        let msg = '';
        let positions = [];

        if (phase === 'game-over' || !this.state.time) return;

        // If it is the first click, initializes clock
        if (phase === 'paused') {
            phase = 'playing'
            if (!Game.timerID) Game.timerID = setInterval(() => {
                let time = this.state.time;
                time--;
                this.setState({ time });
                // if time is up: game over
                if (time <= 0) {
                    [values, cssClass] = OpenAllSquares(this.state.values,this.state.cssClass,this.state.mines,this.state.size,this.state.bomb);
                    this.setState({ values , cssClass , phase: 'game-over', msg: 'Time is Over!' });
                    clearInterval(Game.timerID);
                }
            },1000);
        }

        // if clicked with left button
        if (mouse.button === 0) {
            // if square was already clicked, then return.
            if (cssClass[index]) return;

            // if square is a bomb, game-over
            if (this.state.mines.includes(index)) {
                [values, cssClass] = OpenAllSquares(values, cssClass, this.state.mines, this.state.size, this.state.bomb);
                cssClass[index] = 'clicked'
                phase = 'game-over';
                msg = 'Exploded!!!';
                clearInterval(Game.timerID);
            // if square is not a bomb, count bombs around the square
            // Update value with the number of bombs and cssClass with
            // 'clicked ' + the number of bombs as text
            // positions keep the indexes of the squares around
            } else {
                [values[index], cssClass[index], positions] = CountBombs(this.state.size, this.state.mines, index);
                if (values[index] === 0) values[index] = '';
            }
            // if square has no bomb around, open all the squares around
            if (!values[index]) for (const i of positions)
                [values, cssClass] = OpenSquares(i, values, cssClass, this.state.mines, this.state.size, this.state.bomb);
        // if clicked with right button
        } else if (mouse.button === 2) {
            // if the button is clicked, return
            if (cssClass[index] && cssClass[index] !== 'saved') return;

            // Cycle through the symbols '' (nothing), '\u2691' (saved) and '?' (maybe) with each click
            values[index] = values[index] === '' ? '\u2691' : values[index] === '\u2691' ? '?' : '';
            // set the corresponding cssClass if the 'saved' symbol is used
            if (values[index] === '\u2691') cssClass[index] = 'saved';
            else cssClass[index] = '';
        }

        // Check if only the bomb squares are not clicked, if yes -> Victory!
        if (phase !=='game-over' && this.state.mines.length === cssClass.filter(x => x.indexOf('clicked') === -1).length) {
            phase = 'game-over';
            msg = 'Victory!';
            clearInterval(Game.timerID);
            [values, cssClass] = OpenAllSquares(values, cssClass, this.state.mines, this.state.size, this.state.bomb, true);
        }

        // save the current state
        this.setState({ values, cssClass, phase, msg });
    }

    levelControl (element) {
        const level = element.currentTarget.value;
        let size = 15; // level Hard
        let minesNumber = 40; // level Hard

        if (level === 'easy') {
            size = 9;
            minesNumber = 10;
        }
        if (level === 'intermediate') {
            size = 12;
            minesNumber = 25;
        }

        this.setState({ size, level });
        this.restartGame(size, minesNumber);
    }

    render () {
        const mines = this.state.mines;
        const cssClass = this.state.cssClass;
        // Count the number of mines already discovered (saved)
        const bombs = mines.length - cssClass.filter(x => x === 'saved').length - cssClass.filter(x => x === 'saved-true').length;

        return (<div>
            <div className="title">Minesweeper</div>
            <div className="game-area">
                <div>
                <GameInfo bombs={bombs} time={this.state.time} msg={this.state.msg}/>
                <div className="game">
                    <Board state={this.state} clickHandle={(mouse, i) => this.clickHandle(mouse, i)}/>
                </div>
                <Menu level={this.state.level} levelControl={(element) => this.levelControl(element)}/>
                <div className="restart">
                    <button className="restart-button" onClick={() => this.restartGame()}>Restart Game</button>
                </div>
                </div>
            </div>
        </div>);
    }
}

function OpenAllSquares (values, cssClass, mines, size, bombSymbol, win=false) {
    for (let index = 0; index < values.length; index++) {
        if (mines.includes(index)) {
            values[index] = cssClass[index] === 'saved' || win ? '\u2713' : bombSymbol;
            cssClass[index] = cssClass[index] === 'saved' || win ? 'saved-true' : 'clicked exploded';
        }
        if (cssClass[index] === 'saved') {
            values[index] = '\u2717';
            cssClass[index] = 'exploded';
        }
        if (!cssClass[index]) {
            [values[index], cssClass[index]] = CountBombs(size, mines, index);
            if (values[index] === 0) values[index] = '';
        }
    }
    return [values, cssClass];
}

function OpenSquares (index, values, cssClass, mines, size, bombSymbol) {
    let positions = [];

    // if square was already clicked, then return.
    if (cssClass[index]) return [values, cssClass];

    // Count bombs around the square, update value with the number of bombs
    // and cssClass with 'clicked ' + the number of bombs as text
    // positions keep the indexes of the squares around
    [values[index], cssClass[index], positions] = CountBombs(size, mines, index);
    if (values[index] === 0) values[index] = '';

    // if square has no bomb around, open all the squares around
    if (!values[index]) for (const i of positions)
        [values, cssClass] = OpenSquares(i, values, cssClass, mines, size, bombSymbol);

    // return the updated values and cssClasses -> return them to clickHandle to update state
    return [values, cssClass];
}

function CountBombs (size, mines, index) {
    const cssClasses = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    let positions = [index - size - 1, index - size, index - size + 1, index - 1, index + 1, index + size -1, index + size, index + size + 1];
    const borderA = Array(size);
    const borderB = Array(size);
    let border = [];

    // Which indexes are at the borders
    for (let i=0; i < size; i++) {
        borderA[i] = i * size;
        borderB[i] = (i + 1) * size - 1;
    }
    
    // If the index is in one of the borders, we don't want to count
    // bombs that are in the other border
    if (borderA.includes(index)) border = borderB;
    if (borderB.includes(index)) border = borderA;

    // Find itens that are above or below the board
    // and itens that are in the other border and remove them
    for (let i=0; i < 8; i++) {
        if (positions[i] < 0 || border.includes(positions[i]) || positions[i] > size ** 2 - 1)
            positions.splice(i, 1, '');
    }
    positions = positions.filter(x => x !== '');

    // Count bombs in adjacent squares
    let bombs = 0;
    for (const i of positions) if (mines.includes(i)) bombs++;

    // return the number of bombs, the updated cssClass and the valid positions around index
    return([bombs, 'clicked ' + cssClasses[bombs], positions])
}

function Zerofill (number,width) {
    let sign = '';

    if (number < 0) {
        number *= -1;
        sign = '-';
    }

    width -= number.toString().length - 1;
    if ( width > 0 )
        return sign + new Array(width).join('0') + number;
    
    // Always return a string
    return sign + number + "";
}

ReactDOM.render(
    <Game size={9} minesNumber={10} time={120}/>,
    document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    const cssClass = props.squareCSS + ' square';
    let value = props.squareValue;
    const clickHandle = (mouse) => props.clickHandle(mouse);
    const contextHandle = (mouse) => {mouse.preventDefault(); props.clickHandle(mouse);}

    return (
        <button className={cssClass} onClick={clickHandle} onContextMenu={contextHandle}>
            {value}
        </button>
    );
}

function BoardRow (props) {

    const columns = props.squaresValues.map((squareValue, column) =>
        <Square key={'square-' + props.row.toString() + '-' + column.toString()}
            squareValue={squareValue}
            squareCSS={props.squaresCSS[column]}
            clickHandle={(mouse) => props.clickHandle(mouse, column)}/>
    );

    return(
        <div className="board-row">
            {columns}
        </div>
    );
}

function Board (props) {
    const rowsNumber = props.rowsNumber;
    const columnsNumber = props.columnsNumber;

    const rows = Array(rowsNumber);

    for (let row = 0; row < rowsNumber; row++) {
        const initIndex = row * columnsNumber;
        const endIndex = initIndex + columnsNumber;
        const squaresValues = props.squaresValues.slice(initIndex, endIndex);
        const squaresCSS = props.squaresCSS.slice(initIndex, endIndex);
        rows[row] = <BoardRow key={'row-' + row.toString()}
            row={row}
            squaresValues={squaresValues}
            squaresCSS={squaresCSS}
            clickHandle={(mouse, column) => props.clickHandle(mouse, initIndex + column)}/>
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
                <p>{Zerofill(props.bombsNumber,3)}</p>
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
            <input type="radio" name="level"
            id={props.level}
            value={props.level}
            checked={props.checked}
            onChange={onChange}/>
            <label htmlFor={props.level}> {label}</label>
        </div>
    );
}

function Menu (props) {
    const levelControl = (element) => props.levelControl(element);
    const levels = ['easy', 'intermediate', 'hard'];

    const radios = levels.map((level, index) =>
        <LevelOption key={'op-' + index.toString()}
        level={level}
        checked={props.level === level}
        levelControl={levelControl}/>
    );

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
        const rowsNumber = props.rows;
        const columnsNumber = props.columns;

        // sorting mines positions
        const minesPositions = Array(props.minesNumber);
        for (let i = 0; i < props.minesNumber; i++) {
            const index = Math.floor(Math.random() * rowsNumber * columnsNumber);
            if (!minesPositions.includes(index)) minesPositions[i] = index;
            else i--;
        }

        // sorting bomb symbol
        const bombs = ['\u2620','\u2622','\u2623'];
        const index = Math.floor(Math.random() * bombs.length);

        // setting initial state
        this.state = {
            init: true,
            squaresValues: Array(rowsNumber * columnsNumber).fill(''),
            squaresCSS: Array(rowsNumber * columnsNumber).fill(''),
            minesPositions,
            initialTime: props.time,
            time: props.time,
            rowsNumber,
            columnsNumber,
            bombSymbol: bombs[index],
            phase: 'paused',
            level: 'easy',
            msg: '',
        };
    }

    // when mounting, set timer to null
    componentDidMount () { Game.timerID = null; }

    // when unmouting, reset timer
    componentWillUnmount () { if (Game.timerID) clearInterval(Game.timerID); }

    restartGame (rowsNumber = null, columnsNumber = null, minesNumber = null) {
        // reseting size
        if (!rowsNumber) rowsNumber = this.state.rowsNumber;
        if (!columnsNumber) columnsNumber = this.state.columnsNumber;
        if (!minesNumber) minesNumber = this.state.minesPositions.length;

        // sorting mines positions
        const minesPositions = Array(minesNumber);
        for (let i = 0; i < minesNumber; i++) {
            const index = Math.floor(Math.random() * rowsNumber * columnsNumber);
            if (!minesPositions.includes(index)) minesPositions[i] = index;
            else i--;
        }

        // resseting timer
        const time = this.state.initialTime;
        if (Game.timerID) clearInterval(Game.timerID);
        Game.timerID = null;

        // sorting new bomb symbol
        const bombs = ['\u2620','\u2622','\u2623'];
        const index = Math.floor(Math.random() * bombs.length);

        // reseting state
        this.setState({
            init: false,
            squaresValues: Array(rowsNumber * columnsNumber).fill(''),
            squaresCSS: Array(rowsNumber * columnsNumber).fill(''),
            minesPositions,
            time,
            rowsNumber,
            columnsNumber,
            bombSymbol: bombs[index],
            phase: 'paused',
            msg: ''
        });
    }

    clickHandle (mouse, index) {
        let squaresValues = this.state.squaresValues.slice();
        let squaresCSS = this.state.squaresCSS.slice();
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
                    const squaresValues = this.state.squaresValues.slice();
                    const squaresCSS = this.state.squaresCSS.slice();
                    OpenAllSquares(squaresValues, squaresCSS,
                        this.state.minesPositions,
                        this.state.bombSymbol,
                        this.state.rowsNumber,
                        this.state.columnsNumber);
                    this.setState({ squaresValues , squaresCSS , phase: 'game-over',
                        msg: 'Time is Over!' });
                    clearInterval(Game.timerID);
                }
            },1000);
        }

        // if clicked with left button
        if (mouse.button === 0) {
            // if square was already clicked, then return.
            if (squaresCSS[index]) return;

            // if square is a bomb, game-over
            if (this.state.minesPositions.includes(index)) {
                OpenAllSquares(squaresValues, squaresCSS, this.state.minesPositions,
                    this.state.bombSymbol, this.state.rowsNumber, this.state.columnsNumber);
                squaresCSS[index] = 'clicked'
                phase = 'game-over';
                msg = 'Exploded!!!';
                clearInterval(Game.timerID);
            // if square is not a bombSymbol, count bombs around the square
            // Update value with the number of bombs and squaresCSS with
            // 'clicked ' + the number of bombs as text
            // positions keep the indexes of the squares around
            } else {
                [squaresValues[index], squaresCSS[index], positions] =
                    CountBombs(index,
                        this.state.minesPositions,
                        this.state.rowsNumber,
                        this.state.columnsNumber);
                if (squaresValues[index] === 0) {
                    squaresValues[index] = '';
                // if square has no bombSymbol around, open all the squares around
                    for (const position of positions)
                        OpenSquares(position, squaresValues, squaresCSS,
                        this.state.minesPositions,
                        this.state.rowsNumber,
                        this.state.columnsNumber);
                }
            }
        // if clicked with right button
        } else if (mouse.button === 2) {
            // if the button is clicked, return
            if (squaresCSS[index] && squaresCSS[index] !== 'saved') return;

            // Cycle through the symbols '' (nothing), '\u2691' (saved) and
            // '?' (maybe) with each click
            squaresValues[index] = squaresValues[index] === '' ? '\u2691' :
                squaresValues[index] === '\u2691' ? '?' : '';
            // set the corresponding squaresCSS if the 'saved' symbol is used
            if (squaresValues[index] === '\u2691') squaresCSS[index] = 'saved';
            else squaresCSS[index] = '';
        }

        // Check if only the bombSymbol squares are not clicked, if yes -> Victory!
        if (phase !=='game-over' && this.state.minesPositions.length ===
            squaresCSS.filter(x => x.indexOf('clicked') === -1).length) {
            phase = 'game-over';
            msg = 'Victory!';
            clearInterval(Game.timerID);
            OpenAllSquares(squaresValues, squaresCSS, this.state.minesPositions,
                this.state.bombSymbol, this.state.rowsNumber, this.state.columnsNumber, true);
        }

        // save the current state
        this.setState({ squaresValues, squaresCSS, phase, msg });
    }

    levelControl (element) {
        const level = element.currentTarget.value;
        let rows = 13; // level Hard
        let columns = 18; // level Hard
        let minesNumber = 40; // level Hard 17%

        if (level === 'easy') {
            rows = 9;
            columns = 9;
            minesNumber = 10; // 12%
        }
        if (level === 'intermediate') {
            rows = 12;
            columns = 12;
            minesNumber = 22; // 15%
        }

        this.setState({ level });
        this.restartGame(rows, columns, minesNumber);
    }

    render () {
        const minesNumber = this.state.minesPositions.length;
        const squaresCSS = this.state.squaresCSS;
        // Count the number of mines already discovered (saved)
        const bombsNumber = minesNumber - squaresCSS.filter(x => x === 'saved').length
            - squaresCSS.filter(x => x === 'saved-true').length;

        return (<>
            <HomeScreen init={this.state.init} onClick={() => this.restartGame()}/>
            <div className="title">Minesweeper</div>
            <div className="container">
                <div className="game-area">
                    <GameInfo bombsNumber={bombsNumber} time={this.state.time}
                        msg={this.state.msg}/>
                    <div className="game">
                        <Board squaresValues={this.state.squaresValues}
                            squaresCSS={this.state.squaresCSS}
                            rowsNumber={this.state.rowsNumber}
                            columnsNumber={this.state.columnsNumber}
                            clickHandle={(mouse, i) => this.clickHandle(mouse, i)}/>
                    </div>
                    <Menu level={this.state.level}
                        levelControl={(element) => this.levelControl(element)}/>
                    <div className="restart">
                        <button className="restart-button"
                            onClick={() => this.restartGame()}>
                            Restart Game
                        </button>
                    </div>
                </div>
            </div>
        </>);
    }
}

function HomeScreen (props) {
    let txtClass = 'initial-txt'
    let imgClass = 'initial-img';
    let btnClass = 'restart-button abs-btn';
    let divClass = 'initial';
    if (!props.init) {
        txtClass += ' trigger';
        imgClass += ' trigger';
        btnClass += ' trigger';
        divClass += ' trigger';
    }

    return (
        <div className={divClass}>
            <img className={imgClass} alt="background" src="./Minebackground.png"/>
            <img className={imgClass + ' mine'} alt="Mine by Samuel Schoenberger from the Noun Project" src="./MinelogoSolo.png"/>
            <div className={txtClass}>* Mine icon by Samuel Schoenberger from the Noun Project</div>
            <button className={btnClass} onClick={props.onClick}>START</button>
        </div>
    );
}

function OpenAllSquares (squaresValues, squaresCSS, minesPositions, bombSymbol, rows, columns, win=false) {
    for (let index = 0; index < squaresValues.length; index++) {
        if (minesPositions.includes(index)) {
            squaresValues[index] = squaresCSS[index] === 'saved' || win ? '\u2713' :
                bombSymbol;
            squaresCSS[index] = squaresCSS[index] === 'saved' || win ? 'saved-true' :
                'clicked exploded';
        }
        if (squaresCSS[index] === 'saved') {
            squaresValues[index] = '\u2717';
            squaresCSS[index] = 'exploded';
        }
        if (!squaresCSS[index]) {
            [squaresValues[index], squaresCSS[index]] = CountBombs(index, minesPositions,
                rows, columns);
            if (squaresValues[index] === 0) squaresValues[index] = '';
        }
    }
    return;
}

function OpenSquares (index, squaresValues, squaresCSS, minesPositions, rows, columns) {
    let allPositions = [index];
    let positions = [];
    let i = 0;

    while (true) {
        // if square was not clicked:
        if (!squaresCSS[allPositions[i]]) {
            // Count bombs around the square, update value with the number of bombs
            // and squaresCSS with 'clicked ' + the number of bombs as text
            // positions keep the indexes of the squares around
            [squaresValues[allPositions[i]], squaresCSS[allPositions[i]], positions] =
                CountBombs(allPositions[i], minesPositions, rows, columns);
            if (squaresValues[allPositions[i]] === 0) {
                squaresValues[allPositions[i]] = '';
                for (const pos of positions) 
                    if (!allPositions.includes(pos))
                        allPositions.push(pos);
            }
        }
        if (i < allPositions.length - 1) i++;
        else return;
    }
}

function CountBombs (index, minesPositions, rowsNumber, columnsNumber) {
    const cssClasses = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
    // index = row * columnsNumber + column
    // index/columnsNumber = row (quotient) + column/columnsNumber (remainder)
    const rowInit = Math.floor(index / columnsNumber);
    const columnInit = index % columnsNumber;
    let positions = [];

    for (let row = rowInit - 1; row < rowInit + 2; row++) {
        if (row < 0 || row > rowsNumber - 1) continue;
        for (let column = columnInit -1; column < columnInit + 2; column++) {
            if (row === rowInit && column === columnInit) continue;
            if (column < 0 || column > columnsNumber - 1) continue;
            positions.push(row * columnsNumber + column);
        }
    }

    // Count bombs in adjacent squares
    let bombs = 0;
    for (const position of positions) if (minesPositions.includes(position)) bombs++;

    // return the number of bombs, the updated cssClass and the valid positions around index
    return([bombs, 'clicked ' + cssClasses[bombs], positions]);
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
    <Game rows={9} columns={9} minesNumber={10} time={120}/>,
    document.getElementById('root')
);
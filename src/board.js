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

export default function Board (props) {
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
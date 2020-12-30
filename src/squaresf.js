export function OpenAllSquares (squaresValues, squaresCSS, minesPositions, bombSymbol, rows, columns, win=false) {
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

export function OpenSquares (index, squaresValues, squaresCSS, minesPositions, rows, columns) {
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

export function CountBombs (index, minesPositions, rowsNumber, columnsNumber) {
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
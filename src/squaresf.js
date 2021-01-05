import { stringifyUrl } from 'query-string';

const connectionURL = 'https://minesweeper-bke.herokuapp.com'

export async function startNewGame (body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    const response = await fetch(`${connectionURL}/Init`, requestOptions);
    const data = await response.json();
    console.log(data.msg);
    return data;
}

export async function OpenSquare (body) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    const url = stringifyUrl({
        url: `${connectionURL}/OpenSquare/`,
        query: body
    });

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log(data.msg);
    return data;
}

export async function restartGame (body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    const response = await fetch(`${connectionURL}/Restart`, requestOptions);
    const data = await response.json();
    console.log(data.msg);
    return;
}
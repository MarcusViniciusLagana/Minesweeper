import { stringifyUrl } from 'query-string';

export async function startNewGame (body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    const response = await fetch(`http://localhost:3005/Init`, requestOptions);
    const data = await response.json();
    console.log(data.msg);
    return data.id;
}

export async function OpenSquare (body) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    const url = stringifyUrl({
        url: 'http://localhost:3005/OpenSquare/',
        query: body
    });

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    console.log(data.msg);
    const { exploded, squaresValues, squaresCSS } = data;
    return { exploded, squaresValues, squaresCSS };
}

export async function restartGame (body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
    const response = await fetch(`http://localhost:3005/Restart`, requestOptions);
    const data = await response.json();
    console.log(data.msg);
    return;
}
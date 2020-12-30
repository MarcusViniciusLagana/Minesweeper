import React from 'react';

function Image (props) {
    const img = props.img;
    return (
        <img className={props.initialState ? img.activeCSS : img.deactiveCSS} alt={img.alt} src={img.src}/>
    );
}

function Button (props) {
    const btn = props.btn;
    return (
        <button className={props.initialState ? btn.activeCSS : btn.deactiveCSS} onClick={props.clickHandle}>
            {btn.text}
        </button>
    );
}

function Division (props) {
    const div = props.div;
    let content = [];

    for (let idx = 0; idx < div.content.length; idx++) {
        const item = div.content[idx];
        const key = props.index + '-' + item.type + '-' + idx.toString();
        if (item.type === 'text') content.push(item.text);
        if (item.type === 'img') content.push(<Image key={key} initialState={props.initialState} img={item}/>);
        if (item.type === 'btn') content.push(<Button key={key} initialState={props.initialState} btn={item} clickHandle={props.clickHandle}/>);
        if (item.type === 'div') content.push(<Division key={key} index={key} initialState={props.initialState} div={item} clickHandle={props.clickHandle}/>);
    }

    return (
        <div className={props.initialState ? div.activeCSS : div.deactiveCSS}>
            {content}
        </div>
    );
}

export default class OverScreen extends React.Component {

    static invisibleTimer = null;
    static fadeOutTimer = null;

    constructor (props) {
        super(props);
        this.state = {
            initialState: true,
            isVisible: true,
            autoFadeOut: props.autoFadeOut,
            time: props.time * 1000,
            content: props.content,
        }
    }

    // when mounting, set timer to null
    componentDidMount () {
        OverScreen.invisibleTimer = null;
        OverScreen.fadeOutTimer = null;
    }

    // when unmouting, reset timer
    componentWillUnmount () {
        if (OverScreen.invisibleTimer) clearInterval(OverScreen.invisibleTimer);
        if (OverScreen.fadeOutTimer) clearInterval(OverScreen.fadeOutTimer);
    }

    turnInvisible () {
        this.setState({ isVisible: false });
    }

    fadeOut () {
        this.setState({ initialState: false, autoFadeOut: false});
        if (!OverScreen.invisibleTimer)
            OverScreen.invisibleTimer = setTimeout(() => this.turnInvisible(), this.state.time);
        else this.turnInvisible();
    }

    render () {

        if (!this.state.isVisible) return null;

        const div = this.state.content.slice();
        const clickHandle = () => this.fadeOut();
        let content = [];

        for (let idx = 0; idx < div.length; idx++) {
            const item = div[idx];
            const key = item.type + '-' + idx.toString();
            if (item.type === 'text') content.push(item.text);
            if (item.type === 'img') content.push(<Image key={key} initialState={this.state.initialState} img={item}/>);
            if (item.type === 'btn') content.push(<Button key={key} initialState={this.state.initialState} btn={item} clickHandle={clickHandle}/>);
            if (item.type === 'div') content.push(<Division key={key} index={key} initialState={this.state.initialState} div={item} clickHandle={clickHandle}/>);
        }

        if (this.state.autoFadeOut && !OverScreen.fadeOutTimer)
            OverScreen.fadeOutTimer = setTimeout(() => this.fadeOut(), this.state.time);

        return (<> {content} </>);
    }
}
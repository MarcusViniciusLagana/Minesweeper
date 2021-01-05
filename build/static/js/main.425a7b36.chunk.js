(this.webpackJsonpminesweeper=this.webpackJsonpminesweeper||[]).push([[0],{188:function(e,t,n){},192:function(e,t,n){"use strict";n.r(t);var i=n(7),a=n.n(i),r=n(16),s=n(37),c=n(38),u=n(41),o=n(39),l=n(0),m=n(4),b=n.n(m),d=n(98),v=n.n(d),h=n(194),p=n(195),S=n(99),f=n.n(S);function j(e){var t=e.squareCSS+" square",n=e.squareValue;return Object(l.jsx)(f.a,{time:e.holdTime,onClickNHold:function(){return e.clickHandle("right")},onEnd:function(t,n){n||(0===t.button?e.clickHandle("left"):2===t.button&&e.clickHandle("right"))},children:Object(l.jsx)("button",{className:t,onContextMenu:function(e){return e.preventDefault()},children:n})})}function x(e){var t=e.squaresValues.map((function(t,n){return Object(l.jsx)(j,{holdTime:e.holdTime,squareValue:t,squareCSS:e.squaresCSS[n],clickHandle:function(t){return e.clickHandle(t,n)}},"square-"+e.row.toString()+"-"+n.toString())}));return Object(l.jsx)("div",{className:"board-row",children:t})}function g(e){for(var t=e.rowsNumber,n=e.columnsNumber,i=Array(t),a=function(t){var a=t*n,r=a+n,s=e.squaresValues.slice(a,r),c=e.squaresCSS.slice(a,r);i[t]=Object(l.jsx)(x,{row:t,holdTime:e.holdTime,squaresValues:s,squaresCSS:c,clickHandle:function(t,n){return e.clickHandle(t,a+n)}},"row-"+t.toString())},r=0;r<t;r++)a(r);return Object(l.jsx)("div",{className:"game-board",children:i})}function O(e){return Object(l.jsxs)("div",{className:"game-info game",children:[Object(l.jsx)("div",{className:"bombs-time",children:Object(l.jsx)("p",{children:y(e.bombsNumber,3)})}),Object(l.jsx)("div",{className:"game-over",children:Object(l.jsx)("p",{children:e.msg})}),Object(l.jsx)("div",{className:"bombs-time",children:Object(l.jsx)("p",{children:y(e.time,3)})})]})}function y(e,t){var n="";return e<0&&(e*=-1,n="-"),(t-=e.toString().length-1)>0?n+new Array(t).join("0")+e:n+e+""}function C(e){var t=e.level[0].toUpperCase()+e.level.slice(1);return Object(l.jsxs)("div",{className:"input",children:[Object(l.jsx)("input",{type:"radio",name:"level",id:e.level,value:e.level,checked:e.checked,onChange:function(t){return e.levelControl(t)}}),Object(l.jsxs)("label",{htmlFor:e.level,children:[" ",t]})]})}function k(e){var t=function(t){return e.levelControl(t)},n=["easy","intermediate","hard"].map((function(n,i){return Object(l.jsx)(C,{level:n,checked:e.level===n,levelControl:t},"op-"+i.toString())}));return Object(l.jsx)("div",{className:"level game",children:n})}function N(e){var t=e.img;return Object(l.jsx)("img",{className:e.initialState?t.activeCSS:t.deactiveCSS,alt:t.alt,src:t.src})}function T(e){var t=e.btn;return Object(l.jsx)("button",{className:e.initialState?t.activeCSS:t.deactiveCSS,onClick:e.clickHandle,children:t.text})}function I(e){return Object(l.jsx)(l.Fragment,{children:e.txt})}function q(e){return Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)("br",{}),Object(l.jsx)("br",{}),e.txt]})}function w(e){var t=e.txt,n=[];n.push(Object(l.jsx)(I,{txt:t.content[0]},e.index+"-Line-0"));for(var i=1;i<t.content.length;i++){var a=t.content[i],r=e.index+"-Line-"+i.toString();n.push(Object(l.jsx)(q,{txt:a},r))}return Object(l.jsx)(l.Fragment,{children:n})}function D(e){var t=e.div,n=H(t.content,e.initialState,e.clickHandle,e.index);return Object(l.jsx)("div",{className:e.initialState?t.activeCSS:t.deactiveCSS,children:n})}var V=function(e){Object(u.a)(n,e);var t=Object(o.a)(n);function n(e){var i;return Object(s.a)(this,n),(i=t.call(this,e)).state={initialState:!0,isVisible:!0,autoFadeOut:e.autoFadeOut,time:1e3*e.time,content:e.content},i}return Object(c.a)(n,[{key:"componentDidMount",value:function(){n.invisibleTimer=null,n.fadeOutTimer=null}},{key:"componentWillUnmount",value:function(){n.invisibleTimer&&clearInterval(n.invisibleTimer),n.fadeOutTimer&&clearInterval(n.fadeOutTimer)}},{key:"turnInvisible",value:function(){this.setState({isVisible:!1})}},{key:"fadeOut",value:function(){var e=this;this.setState({initialState:!1,autoFadeOut:!1}),n.invisibleTimer?this.turnInvisible():n.invisibleTimer=setTimeout((function(){return e.turnInvisible()}),this.state.time)}},{key:"render",value:function(){var e=this;if(!this.state.isVisible)return null;var t=H(this.state.content.slice(),this.state.initialState,(function(){return e.fadeOut()}));return this.state.autoFadeOut&&!n.fadeOutTimer&&(n.fadeOutTimer=setTimeout((function(){return e.fadeOut()}),this.state.time)),Object(l.jsxs)(l.Fragment,{children:[" ",t," "]})}}]),n}(b.a.Component);function H(e,t,n){for(var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"init",a=[],r=0;r<e.length;r++){var s=e[r],c=i+"-"+s.type+"-"+r.toString();"text"===s.type&&a.push(Object(l.jsx)(w,{index:c,txt:s},c)),"img"===s.type&&a.push(Object(l.jsx)(N,{initialState:t,img:s},c)),"btn"===s.type&&a.push(Object(l.jsx)(T,{initialState:t,btn:s,clickHandle:n},c)),"div"===s.type&&a.push(Object(l.jsx)(D,{index:c,initialState:t,div:s,clickHandle:n},c))}return a}V.invisibleTimer=null,V.fadeOutTimer=null;var F=n(27),M=n(100),A="https://minesweeper-bke.herokuapp.com";function E(e){return P.apply(this,arguments)}function P(){return(P=Object(r.a)(a.a.mark((function e(t){var n,i,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)},e.next=3,fetch("".concat(A,"/Init"),n);case 3:return i=e.sent,e.next=6,i.json();case 6:return r=e.sent,console.log(r.msg),e.abrupt("return",r);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function G(e){return J.apply(this,arguments)}function J(){return(J=Object(r.a)(a.a.mark((function e(t){var n,i,r,s;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={method:"GET",headers:{"Content-Type":"application/json"}},i=Object(M.stringifyUrl)({url:"".concat(A,"/OpenSquare/"),query:t}),e.next=4,fetch(i,n);case 4:return r=e.sent,e.next=7,r.json();case 7:return s=e.sent,console.log(s.msg),e.abrupt("return",s);case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function U(e){return R.apply(this,arguments)}function R(){return(R=Object(r.a)(a.a.mark((function e(t){var n,i,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)},e.next=3,fetch("".concat(A,"/Restart"),n);case 3:return i=e.sent,e.next=6,i.json();case 6:return r=e.sent,console.log(r.msg),e.abrupt("return");case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}n(188);var L=function(e){Object(u.a)(n,e);var t=Object(o.a)(n);function n(e){var i;Object(s.a)(this,n),i=t.call(this,e);var a=e.rowsNumber,r=e.columnsNumber,c=e.minesNumber,u=e.time,o=e.holdTime,l=i.props.cookies;return i.state={gameID:l.get("gameID")||null,rowsNumber:a,columnsNumber:r,minesNumber:c,squaresValues:Array(a*r).fill(""),squaresCSS:Array(a*r).fill(""),initialTime:u,time:u,holdTime:o,phase:"paused",level:"easy",msg:""},i}return Object(c.a)(n,[{key:"componentDidMount",value:function(){var e=Object(r.a)(a.a.mark((function e(){var t,i,r;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n.timerID=null,t=this.props.cookies,!this.state.gameID){e.next=7;break}return e.next=5,U(this.state);case 5:e.next=13;break;case 7:return e.next=9,E(this.state);case 9:i=e.sent,r=i.gameID,t.set("gameID",r),this.setState({gameID:r});case 13:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"componentWillUnmount",value:function(){n.timerID&&clearInterval(n.timerID)}},{key:"restartGame",value:function(){var e=Object(r.a)(a.a.mark((function e(){var t,i,r,s,c=arguments;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=c.length>0&&void 0!==c[0]?c[0]:null,i=c.length>1&&void 0!==c[1]?c[1]:null,(r=c.length>2&&void 0!==c[2]?c[2]:null)||(r=this.state.minesNumber),t||(t=this.state.rowsNumber),i||(i=this.state.columnsNumber),e.next=8,U({gameID:this.state.gameID,rowsNumber:t,columnsNumber:i,minesNumber:r});case 8:s=this.state.initialTime,n.timerID&&clearInterval(n.timerID),n.timerID=null,this.setState({rowsNumber:t,columnsNumber:i,minesNumber:r,squaresValues:Array(t*i).fill(""),squaresCSS:Array(t*i).fill(""),time:s,phase:"paused",msg:""});case 12:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"clickHandle",value:function(){var e=Object(r.a)(a.a.mark((function e(t,i){var r,s,c,u,o,l,m,b=this;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=this.state.squaresValues.slice(),s=this.state.squaresCSS.slice(),c=this.state.minesNumber,u=this.state.phase,o="","game-over"!==u&&this.state.time&&t){e.next=7;break}return e.abrupt("return");case 7:if("paused"===u&&(u="playing",n.timerID||(n.timerID=setInterval((function(){var e=b.state.time;e--,b.setState({time:e}),e<=0&&(b.setState({phase:"game-over",msg:"Time is Over!"}),clearInterval(n.timerID))}),1e3))),"left"!==t){e.next=19;break}if(!s[i]){e.next=11;break}return e.abrupt("return");case 11:return e.next=13,G({gameID:this.state.gameID,index:i,squaresValues:r,squaresCSS:s});case 13:l=e.sent,r=l.squaresValues.slice(),s=l.squaresCSS.slice(),l.exploded&&(s[i]="clicked",u="game-over",o="Exploded!!!",clearInterval(n.timerID)),e.next=24;break;case 19:if("right"!==t){e.next=24;break}if(!s[i]||"saved"===s[i]){e.next=22;break}return e.abrupt("return");case 22:r[i]=""===r[i]?"\u2691":"\u2691"===r[i]?"?":"","\u2691"===r[i]?s[i]="saved":s[i]="";case 24:if("game-over"===u||c!==s.filter((function(e){return-1===e.indexOf("clicked")})).length){e.next=33;break}return u="game-over",o="Victory!",clearInterval(n.timerID),e.next=30,G({gameID:this.state.gameID,index:i,squaresValues:r,squaresCSS:s,win:!0});case 30:m=e.sent,r=m.squaresValues.slice(),s=m.squaresCSS.slice();case 33:this.setState({squaresValues:r,squaresCSS:s,phase:u,msg:o});case 34:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"levelControl",value:function(e){var t=e.currentTarget.value,n=13,i=18,a=40;"easy"===t&&(n=9,i=9,a=10),"intermediate"===t&&(n=12,i=12,a=22),document.documentElement.style.setProperty("--width",40*i+"px"),document.documentElement.style.setProperty("--height",40*n+"px"),this.setState({level:t}),this.restartGame(n,i,a)}},{key:"render",value:function(){var e=this,t=this.state.minesNumber,n=this.state.squaresCSS,i=t-n.filter((function(e){return"saved"===e})).length-n.filter((function(e){return"saved-true"===e})).length,a=null;return"Victory!"===this.state.msg&&(a=Object(l.jsx)(V,{autoFadeOut:!0,time:1,content:F.d})),"Time is Over!"===this.state.msg&&(a=Object(l.jsx)(V,{autoFadeOut:!0,time:1,content:F.c})),"Exploded!!!"===this.state.msg&&(a=Object(l.jsx)(V,{autoFadeOut:!0,time:3,content:F.a})),Object(l.jsxs)(l.Fragment,{children:[Object(l.jsx)(V,{autoFadeOut:!1,time:5,content:F.b}),a,Object(l.jsx)("div",{className:"title",children:"Minesweeper"}),Object(l.jsx)("div",{className:"container",children:Object(l.jsxs)("div",{className:"game-area",children:[Object(l.jsx)(O,{bombsNumber:i,time:this.state.time,msg:this.state.msg}),Object(l.jsx)("div",{className:"game",children:Object(l.jsx)(g,{squaresValues:this.state.squaresValues,squaresCSS:this.state.squaresCSS,rowsNumber:this.state.rowsNumber,columnsNumber:this.state.columnsNumber,holdTime:this.state.holdTime,clickHandle:function(t,n){return e.clickHandle(t,n)}})}),Object(l.jsx)(k,{level:this.state.level,levelControl:function(t){return e.levelControl(t)}}),Object(l.jsx)("div",{className:"restart",children:Object(l.jsx)("button",{className:"restart-button",onClick:function(){return e.restartGame()},children:"Restart Game"})})]})})]})}}]),n}(b.a.Component);L.timerID=null;var W=Object(h.a)(L);v.a.render(Object(l.jsx)(p.a,{children:Object(l.jsx)(W,{rowsNumber:9,columnsNumber:9,minesNumber:10,time:120,holdTime:.3})}),document.getElementById("root"))},27:function(e){e.exports=JSON.parse('{"b":[{"type":"div","activeCSS":"basic initial","deactiveCSS":"basic initial vanish","content":[{"type":"img","activeCSS":"initial-img","deactiveCSS":"initial-img vanish","alt":"background","src":"./Minebackground.png"},{"type":"img","activeCSS":"initial-img mine","deactiveCSS":"initial-img mine vanish","alt":"Mine by Samuel Schoenberger from the Noun Project","src":"./MinelogoSolo.png"},{"type":"div","activeCSS":"initial-txt","deactiveCSS":"initial-txt vanish","content":[{"type":"text","content":["* Mine icon by Samuel Schoenberger from the Noun Project"]}]},{"type":"btn","activeCSS":"restart-button btn-position","deactiveCSS":"restart-button btn-position vanish","text":"START"}]}],"d":[{"type":"div","activeCSS":"basic transparent","deactiveCSS":"basic transparent","content":[{"type":"div","activeCSS":"basic-bg victory","deactiveCSS":"basic-bg victory","content":[{"type":"text","content":["VICTORY !!!"]}]}]}],"c":[{"type":"div","activeCSS":"basic transparent","deactiveCSS":"basic transparent","content":[{"type":"div","activeCSS":"basic-bg time","deactiveCSS":"basic-bg time","content":[{"type":"text","content":["Time is Over !!!"]}]}]}],"a":[{"type":"div","activeCSS":"basic blood-transparent","deactiveCSS":"basic blood","content":[{"type":"img","activeCSS":"explosion-position bomb","deactiveCSS":"explosion-position bomb","alt":"explosion","src":"./explosion.png"},{"type":"div","activeCSS":"foot-movement","deactiveCSS":"foot-movement","content":[{"type":"img","activeCSS":"explosion-position foot","deactiveCSS":"explosion-position foot","alt":"foot","src":"./foot.png"}]},{"type":"div","activeCSS":"no-text","deactiveCSS":"basic-bg yes-text","content":[{"type":"text","content":["You Died !!!"]}]},{"type":"btn","activeCSS":"basic transparent","deactiveCSS":"basic transparent","text":null}]}]}')}},[[192,1,2]]]);
//# sourceMappingURL=main.425a7b36.chunk.js.map
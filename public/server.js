!function(){var t=0,e=1,n=2,s=3,o={};"undefined"!=typeof window&&!function(){o.Game=function(){return this.height=400,this.width=400,this.spanX=10,this.spanY=10,this.getRealCoordinates=function(t,e){var n=this;return{x:t*n.width/n.spanX,y:e*n.height/n.spanY,w:n.width/n.spanX,h:n.height/n.spanY}},this},o.Tile={init:function(t,e,n){return{x:t,y:e,type:n}},render:function(t,e){var n=t.getRealCoordinates(e.x,e.y),s=o.c,i=new Image;i.src=o.Tiles[e.type],s.drawImage(i,n.x,n.y,n.w,n.h)}},o.Tiles={},o.Tiles.floor="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAGCAYAAADgzO9IAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AgSERAr62pHoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAWSURBVAjXY5wRzv2fAQtgYsAB6CEBACasAgXtJRiTAAAAAElFTkSuQmCC",function(){function t(){for(var t=0;t<r.length;t++)r[t].setAttribute("disabled","disabled")}function e(){for(var t=0;t<r.length;t++)r[t].removeAttribute("disabled ")}function n(t){h.innerHTML=t}function s(t){a.innerHTML=["<h2>"+t+"</h2>","Won: "+c.win,"Lost: "+c.lose,"Draw: "+c.draw].join("<br>")}function o(){u.on("start",function(){e(),n("Round "+(c.win+c.lose+c.draw+1))}),u.on("win",function(){c.win++,s("You win!")}),u.on("lose",function(){c.lose++,s("You lose!")}),u.on("draw",function(){c.draw++,s("Draw!")}),u.on("end",function(){t(),n("Waiting for opponent...")}),u.on("connect",function(){t(),n("Waiting for opponent...")}),u.on("disconnect",function(){t(),n("Connection lost!")}),u.on("error",function(){t(),n("Connection error!")});for(var o=0;o<r.length;o++)!function(e,n){e.addEventListener("click",function(e){t(),u.emit("guess",n)},!1)}(r[o],o+1)}function i(){u=io({upgrade:!1,transports:["websocket"]}),r=document.getElementsByTagName("button"),h=document.getElementById("message"),a=document.getElementById("score"),t(),o()}var u,r,h,a,c={draw:0,win:0,lose:0};window.addEventListener("load",i,!1)}(),o.canvas=document.getElementById("c"),o.c=o.canvas.getContext("2d");var t=o.Tile.init(1,1,"floor");o.game=new o.Game,o.Tile.render(o.game,t)}(),"undefined"==typeof window&&!function(){"use strict";function o(t){for(var e=0;e<h.length;e++)t!==h[e]&&null===h[e].opponent&&new u(t,h[e]).start()}function i(t){h.splice(h.indexOf(t),1)}function u(t,e){this.user1=t,this.user2=e}function r(e){this.socket=e,this.game=null,this.opponent=null,this.guess=t}var h=[];u.prototype.start=function(){this.user1.start(this,this.user2),this.user2.start(this,this.user1)},u.prototype.ended=function(){return this.user1.guess!==t&&this.user2.guess!==t},u.prototype.score=function(){this.user1.guess===e&&this.user2.guess===s||this.user1.guess===n&&this.user2.guess===e||this.user1.guess===s&&this.user2.guess===n?(this.user1.win(),this.user2.lose()):this.user2.guess===e&&this.user1.guess===s||this.user2.guess===n&&this.user1.guess===e||this.user2.guess===s&&this.user1.guess===n?(this.user2.win(),this.user1.lose()):(this.user1.draw(),this.user2.draw())},r.prototype.setGuess=function(e){return!(!this.opponent||e<=t||e>s)&&(this.guess=e,!0)},r.prototype.start=function(e,n){this.game=e,this.opponent=n,this.guess=t,this.socket.emit("start")},r.prototype.end=function(){this.game=null,this.opponent=null,this.guess=t,this.socket.emit("end")},r.prototype.win=function(){this.socket.emit("win",this.opponent.guess)},r.prototype.lose=function(){this.socket.emit("lose",this.opponent.guess)},r.prototype.draw=function(){this.socket.emit("draw",this.opponent.guess)},module.exports=function(t){var e=new r(t);h.push(e),o(e),t.on("disconnect",function(){i(e),e.opponent&&(e.opponent.end(),o(e.opponent))}),t.on("guess",function(t){e.setGuess(t)&&e.game.ended()&&(e.game.score(),e.game.start())})}}()}();
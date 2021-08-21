
let socket = io();
let id = null;
let match_time = 0;

socket.on("id", _id => {
    id = _id

    console.log(_id);
});

socket.on("match", () => {
    $.ajax({ 
        url : "html/main.html",
        success : result => { 
            document.querySelector("html").innerHTML = result;

            load();
        } 
    });
});

function match() {
    let overlay = document.querySelector(".overlay");
    let match_div = document.querySelector(".match");
    let subject = document.querySelector(".subject");
    
    overlay.style.visibility = "visible";
    match_div.style.visibility = "visible";

    setInterval(() => {
        let minute = Math.floor(match_time / 60);
        let second = match_time - minute * 60; 

        subject.innerText = `${(String(minute).length == 1? "0" : "") + minute}:${(String(second).length == 1? "0" : "") + second}`;
        
        match_time += 1;
    }, 1000);

    socket.emit("match", id);
}

function load() {
    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");
    
    function initImage() {
        let human_state1 = new Image();
        human_state1.src = "image/human_state1.png";
        human_state1.w = 100;
        human_state1.h = 700;

        let human_state2 = new Image();
        human_state2.src = "image/human_state2.png";
        human_state2.w = 250;
        human_state2.h = 550;

        let human_state3 = new Image();
        human_state3.src = "image/human_state3.png";
        human_state3.w = 100;
        human_state3.h = 550;

        let reverse_human_state1 = new Image();
        reverse_human_state1.src = "image/reverse_human_state1.png";
        reverse_human_state1.w = 100;
        reverse_human_state1.h = 700;

        let reverse_human_state2 = new Image();
        reverse_human_state2.src = "image/reverse_human_state2.png";
        reverse_human_state2.w = 250;
        reverse_human_state2.h = 550;

        let reverse_human_state3 = new Image();
        reverse_human_state3.src = "image/reverse_human_state3.png";
        reverse_human_state3.w = 100;
        reverse_human_state3.h = 550;

        let guard = new Image();
        guard.src = "image/guard.png";

        return [
            human_state1, 
            human_state2, 
            human_state3, 
            reverse_human_state1, 
            reverse_human_state2, 
            reverse_human_state3,
            guard
        ];
    }

    function processKeyEvent() {
        document.addEventListener("keyup", e => {
            let key_code = e.keyCode;

            // 1, 2 key 에 관한 처리
            if(key_code == 49) {
                if(!is_cool) {
                    socket.emit("state", [id, "state2", x, y]);

                    // sting 쿨타임
                    is_cool = true;

                    setTimeout(() => socket.emit("state", [id, "state1", x, y]), 300);
                    setTimeout(() => is_cool = false, 1000);
                }
            
            } else if(key_code == 50) {
                if(guard_count > 0) {
                    guard_count -= 1;

                    socket.emit("state", [id, "state3", x, y]);
                }
            }

            if(!is_pause) {
                // arrow key 에 대한 처리
                if(key_code == 37) {
                    x -= 30;
    
                    socket.emit("move", [id, x, y]);
    
                } else if(key_code == 38) {
    
                } else if(key_code == 39) {
                    x += 30;
                    
                    socket.emit("move", [id, x, y]);
    
                } else if(key_code == 40) {
    
                }
            }
        });
    }

    function checkWall() {
        let p = player[id];
        let px = p.x;

        if(px < 0) {
            x += 30;

            socket.emit("move", [id, x, y]);
        }
    }

    function checkCrash() {
        if(is_pause) return;

        let p = player[id];
        let px = p.x + p.state.w;

        let keys = Object.keys(player);

        for(let i=0; i<keys.length; i++) {
            let key = keys[i];
        
            if(key != id) {
                let crash_x = player[key].x - player[key].state.w;

                if(px >= crash_x) {
                    if(p.state == state1 && player[key].state == reverse_state2) {
                        socket.emit("call", "lose");
                    
                    } else if(p.state == state2 && player[key].state == reverse_state1) {
                        socket.emit("call", "win");
                    
                    } else if(p.state == state3 && player[key].state == reverse_state2) {
                        socket.emit("call", "guard");
                    
                    } else if(p.state == state2 && player[key].state == reverse_state3) {
                        socket.emit("call", "guard");
                    
                    } else {
                        socket.emit("call", "draw");
                    }

                    is_pause = true;

                    break;
                }
            }
        }
    }

    function drawCharacter(state, x, y) {
        let _x = x; _y = y
        
        state == state2 || state == reverse_state2? _y += 150 : 0;
        state == state3 || state == reverse_state3? _y += 150 : 0;
        state == reverse_state1 || state == reverse_state2 || state == reverse_state3? _x -= state.w : 0;

        context.drawImage(state, _x, _y, state.w, state.h);
    }

    function drawNickName(key) {
        let p = player[key];

        context.font = "400 40pt Open Sans";
        context.fillStyle = "green"
        context.fillText("<개발자 문성>", p.x - 20, p.y + 70, 100);
    }

    function drawGuard() {
        let _x = 10;
        let _y = 30;

        for(let i=0; i<guard_count; i++) {
            context.drawImage(guard, _x, _y, 40, 130);

            _x += 60
        }
    }

    function drawGround() {
        let _x = 0;
        let _y = 100;

        context.fillStyle = "gray";
        context.fillRect(_x, canvas.height - _y, canvas.width, _y);
    }

    let [state1, state2, state3, reverse_state1, reverse_state2, reverse_state3, guard] = initImage();
    let sx = 100, sy = 200;
    let x = sx, y = sy;
    let is_cool = false;
    let is_pause = false;
    let guard_count = 3;

    let player = {};

    socket.emit("alive", [id, x, y]);

    socket.on("dis", id => {
        delete player[id];

        alert("상대방이 게임을 나갔습니다. 메인화면으로 이동합니다.");

        location.href = "/";
    });

    socket.on("call", info => {
        let [_id, ids, state] = info;
        let point1 = document.querySelector(".point1");
        let point2 = document.querySelector(".point2");
        
        if(state == "win") {
            id == _id?
                point1.innerText = Number(point1.innerText) + 1 :
                point2.innerText = Number(point2.innerText) + 1;
        
        } else if(state == "lose") {
            id == _id?
                point2.innerText = Number(point2.innerText) + 1 :
                point1.innerText = Number(point1.innerText) + 1;

        } else if(state == "guard") {
            is_pause = false;

            socket.emit("state", [ids[0], "state1", x, y]);
            socket.emit("state", [ids[1], "state1", player[ids[1]].x, player[ids[1]].y]);

            return;
        }
        
        if(state == "game win") {
            id == _id?
                alert("당신의 승리!") :
                alert("상대방의 승리!");

            location.href = "/";
            
        } else if(state == "game lose") {
            id == _id?
                alert("상대방의 승리!") :
                alert("당신의 승리!");

            location.href = "/";
        }
                    
        if(Number(point1.innerText) >= 10) {
            id == _id? 
                socket.emit("call", "game win") :
                socket.emit("call", "game lose");

            return;

        } else if(Number(point2.innerText) >= 10) {
            id == _id? 
                socket.emit("call", "game lose") :
                socket.emit("call", "game win");
        
            return;
        }

        setTimeout(() => {
            socket.emit("state", [id, "state1", sx, sy]);

            x = sx, y = sy, is_pause = false;

            socket.emit("move", [id, x, y]);
        }, 2000);
    });

    socket.on("move", info => {
        if(player[info[0]]) {
            info[0] == id?
                [player[info[0]].x, player[info[0]].y] = [info[1], info[2]] :
                [player[info[0]].x, player[info[0]].y] = [canvas.width - info[1], info[2]];
        
        } else {
            info[0] == id?
                player[info[0]] = { x : info[1], y : info[2], state : state1 } :
                player[info[0]] = { x : canvas.width - info[1], y : info[2], state : reverse_state1 };
        }
    });

    socket.on("state", info => {
        if(player[info[0]]) {
            player[info[0]].state = info[1] == "state1"? id == info[0]? state1 : reverse_state1 : player[info[0]].state; 
            player[info[0]].state = info[1] == "state2"? id == info[0]? state2 : reverse_state2 : player[info[0]].state;
            player[info[0]].state = info[1] == "state3"? id == info[0]? state3 : reverse_state3 : player[info[0]].state;

        } else {
            player[info[0]] = { x : info[2], y : info[3], state : state1 }; // state : default

            player[info[0]].state = info[1] == "state1"? id == info[0]? state1 : reverse_state1 : player[info[0]].state; 
            player[info[0]].state = info[1] == "state2"? id == info[0]? state2 : reverse_state2 : player[info[0]].state;
            player[info[0]].state = info[1] == "state3"? id == info[0]? state3 : reverse_state3 : player[info[0]].state;
        }
    });

    processKeyEvent();

    let iter = setInterval(() => {
        if(!is_pause) {
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            Object.keys(player).forEach(key => {
                drawCharacter(player[key].state, player[key].x, player[key].y);
                // drawNickName(key);
                drawGuard();
                drawGround();
                checkWall();
                checkCrash();
            });
        }
    }, 10); // 1초에 100번
}
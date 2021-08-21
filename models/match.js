
module.exports = class Match {
    constructor(io) {
        this.match_list = {};
        this.room_list = {};
        this.room_count = 0;
        this.delay = 2000;
        this.iter = null;
        this.io = io;
    }

    _loop() {
        this.iter = setInterval(() => {
            this._check();

            let final_matching_list = [];
            let matching_list = Object.keys(this.match_list).filter(key => {
                if(this.match_list[key]) return key;
            });

            if(matching_list.length % 2 != 0) 
                matching_list.splice(Math.floor(Math.random() * matching_list.length), 1);

            while(matching_list.length) final_matching_list.push(matching_list.splice(0, 2));

            this._match(final_matching_list);
        }, this.delay);
    }

    _check() {
        if(Object.keys(this.match_list).length == 0) {
            clearInterval(this.iter);

            this.iter = null;
        }
    }

    _match(list) {
        list.forEach(async (players) => {
            let room_name = "room" + this.room_count;
            let socket1 = this.match_list[players[0]].socket;
            let socket2 = this.match_list[players[1]].socket;

            socket1.join(room_name);
            socket2.join(room_name);

            this.room_list[room_name] = { player : players, leader : players[0] };
            this.room_count += 1;

            delete this.match_list[players[0]];
            delete this.match_list[players[1]];

            this.io.to(room_name).emit("match");

            console.log("create a " + room_name);
        });
    }

    _findPlayerRoom(id) {
        let keys = Object.keys(this.room_list);

        for(let i=0; i<keys.length; i++) {
            if(this.room_list[keys[i]].player.indexOf(id) != -1)
                return keys[i];
        }

        return null;
    }

    event(event_name, data, id) {
        let room = this._findPlayerRoom(id);

        if(event_name == "call") {
            if(id == this.room_list[room].leader)
                this.io.to(room).emit(event_name, [id, this.room_list[room].player, data]);    

        } else {
            this.io.to(room).emit(event_name, data);
        }
    }

    add(_socket, id) {
        this.match_list[id] = { socket : _socket };

        if(this.iter == null) {
            this._loop();
        }
    }

    delete(id) {
        if(this.match_list[id])
            delete this.match_list[id];

        let room = this._findPlayerRoom(id);

        if(room)
            delete this.room_list[room];
    }
}
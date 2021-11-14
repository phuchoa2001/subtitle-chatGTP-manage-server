var MenberOnline = [];
var DataMessger = {};
var groupPublit = [];
function Socket(io) {
    function dq() {
        setTimeout(() => {
            MenberOnline = [];
            DataMessger = {}
            groupPuclit = [];
            dq()
        }, 1800000);
    }
    dq()
    io.on("connection", function (socket) {
        socket.leave(socket.id);
        socket.on("room", function (data) {
            resetapp(data)
            createRoom();
        })
        socket.on("changeName", function (data) {
            MenberOnline.map((item) => {
                item.name == socket.name ? item.name = data.name + `(${socket.id})` : "";
            })
            changeDataMessger(data.room, data.name, socket.name)
            resetapp(data);
        })
        socket.on("newroom", function (data) {
            console.log(data);
            socket.leave(socket.phong);
            resetapp(data, true);
            createRoom();
        })
        socket.on("ChatMessger", data => {
            !DataMessger[data.room] ? DataMessger[data.room] = [] : "";
            DataMessger[data.room].push(data);
            io.sockets.in(data.room).emit("ListMessger", DataMessger[data.room]);
        })
        socket.on("creactroom", data => {
            socket.join(data.room);
            socket.leave(socket.phong);
            groupPublit.push(data.room);
            socket.phong = data.room;
            createRoom();
        })
        function resetapp(data, newroom) {
            // a Set containing all the connected socket ids
            socket.phong = data.room;
            if (!newroom) {
                socket.name = data.name + `(${socket.id})`;
                data.name += `(${socket.id})`;
                socket.emit("id", socket.id);
            }
            data.id = socket.id;
            MenberOnline.push(data)
            socket.join(data.room);
            const listMenber = Array.from(socket.adapter.rooms.get(data.room).keys());
            const Menbergd = [];
            listMenber.map((menber) => {
                const nameMenber = MenberOnline.find((menber_ON) => menber == menber_ON.id && menber_ON.name);
                Menbergd.push(nameMenber);
            })
            io.sockets.in(data.room).emit("listmenber", Menbergd);
            !DataMessger[data.room] ? DataMessger[data.room] = [] : "";
            io.sockets.in(data.room).emit("ListMessger", DataMessger[data.room]);
        }
        function createRoom() {
            const Araykeys = Array.from(socket.adapter.rooms.keys())
            const listroom = Array.from(Araykeys.keys()).map(v => Araykeys[v]);
            const resultPunlic = [];
            console.log(listroom, "listroom");
            listroom.map((room) => {
                const array = groupPublit.find((public) => room == public);
                array && resultPunlic.push(array);
            })
            io.sockets.emit("listroom", resultPunlic);
        }
        function changeDataMessger(room, namenew, newold) {
            DataMessger[room].map((item) => {
                item.name == newold ? item.name = namenew + `(${socket.id})` : '';
            })
        }
    });
};
module.exports = Socket;
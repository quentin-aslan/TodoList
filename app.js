const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, serverRun(port));
const io = require('socket.io')(server);

function serverRun(port) {
    console.log('Server listener on port :'+port);
}

app.use(express.json());// for parsing application/json
app.use(express.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded

var todoList = ['Work work work', 'Faire les courses'];

app.get('/', (req, res) => {
   res.sendFile(__dirname+'/index.html');
});

io.on('connection', (socket) => {

    socket.broadcast.emit('new user');
    socket.emit('refresh todo', todoList);

    socket.on('new todo', (todo) => {
       todoList.push(todo);
       io.emit('refresh todo', todoList);
    });

    socket.on('delete todo', (index) => {
       todoList.splice(index, 1);
       io.emit('refresh todo', todoList);
    });

});
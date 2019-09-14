const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const documents = {};
var players = []
var playerId = 0
drawings = []
const PORT = 4444;

/** Socket Event listener */
io.on('connection', socket => {
    let previousId;

    const joinRoom = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    }

    const leaveRoom = currentId => {
        socket.leave(currentId)
    }


    socket.on('getDoc', docId => {
        safeJoin(docId);
        socket.emit('document', documents[docId]);
    });

    socket.on('addDoc', doc => {
        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit('documents', Object.keys(documents));
        socket.emit('document', doc);
    });

    socket.on('editDoc', doc => {
        console.log("edit")
        documents[doc.id] = doc;
        socket.to(doc.id).emit('document', doc);
    });

    socket.on('data', function (data) {
        console.log(socket.id +': ' + data.msg);
        var message = {from: socket.id,
                       msg: data.msg
                       }
        io.emit('newMsg', message)
    })

    socket.on('startGame', ()=> {
        io.emit("gameStarted", true)
    })

    socket.on('submitDrawing', generatedString => {
        drawings.push(generatedString)
        console.log(drawings)
        io.emit('drawings', drawings)
    });

    socket.on('playerJoin', newPlayer => {
        players.push(newPlayer)
        io.emit('players', players)
    
        playerId += 1
        io.emit('playerId', playerId)
        console.log("player joined")
        console.log(players)
        
        console.log(playerId)

    });

    

    socket.on('playerLeave', player => {
        players = players.filter(x=>x.id != player.id)
        io.emit('players', players)
        console.log("player left", playerId)
        console.log(players)
    });

    io.emit('documents', Object.keys(documents));

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(PORT, () => {
    console.log('Listening on port ', PORT);
});

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const documents = {};
var players = []
var playerId = 0
var numPlayersDrawing = 0
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
        io.emit('drawings', drawings)
    });

    socket.on('playerJoin', newPlayer => {
        players.push(newPlayer)
        io.emit('players', players)
        playerId += 1
        io.emit('playerId', playerId)
        numPlayersDrawing = players.length
        io.emit('numPlayersDrawing', numPlayersDrawing)

        console.log("player joined")
        console.log(numPlayersDrawing)

    });

    socket.on('playerLeave', player => {
        players = players.filter(x=>x.id != player.id)
        io.emit('players', players)
        console.log("player left", playerId)
        console.log(players)
        console.log(numPlayersDrawing)

    });

    socket.on("updatePlayer", player => {
        for (var i in players) {
            if (players[i].id == player.id) {
               players[i] = player
               break;
            }
        }
        io.emit("players", players)
    })
    
    socket.on('updateAllPlayers', () => {
        io.emit('players', players)
    })

    socket.on('updateNumPlayersDrawing', increment =>{
        if (increment == 0){
            numPlayersDrawing = players.length
        } 
        else {
            numPlayersDrawing += increment
        }
        io.emit("numPlayersDrawing", numPlayersDrawing)
    })

    io.emit('documents', Object.keys(documents));
    console.log(`Socket ${socket.id} has connected`);
});

http.listen(PORT, () => {
    console.log('Listening on port ', PORT);
});

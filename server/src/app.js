const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const documents = {};
drawings = []
const PORT = 4444;

/** Event listener */
io.on('connection', socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
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

    socket.on('submitDrawing', generatedString => {
        drawings.push(generatedString)
        console.log(drawings)
        io.emit('drawings', drawings)
    });

    io.emit('documents', Object.keys(documents));

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(PORT, () => {
    console.log('Listening on port ', PORT);
});

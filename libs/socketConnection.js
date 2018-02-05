module.exports = function (io) {
    io.on('connection', function (socket) {
        socket.on('client message', function (data) {//받을 준비
            io.emit('server message', data.message);//보낼 준비
        });
    });
};
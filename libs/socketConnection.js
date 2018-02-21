require('./removeByValue')();

module.exports = function (io) {
    var userList = [];//사용자 리스트를 저장할 곳
    io.on('connection', function (socket) {
        
        //아래 두줄로 passport의 req.user의 데이터에 접근한다.
        var session = socket.request.session.passport;
        var user = (typeof session !== 'undefined') ? (session.user) : "";
        
        // userList 필드에 사용자 명이 존재 하지 않으면 삽입
        //if (userList.indexOf(user.displayname) === -1){ //index가 -1인 경우는 존재하지 않는 경우
            //userList.push(user.displayname);
        //}
        io.emit('join', userList);//존재하면 io.emit에 뿌려줘
        //사용자 명과 메시지를 같이 반환한다.
        socket.on('client message', function (data) {//받을 준비
            io.emit('server message', { message: data.message, displayname: user.displayname });//보낼 준비
        });
        socket.on('disconnect',function(){
            userList.removeByValue(user.displayname);
            io.emit('leave',userList);
        });
    });
};
const io = require('socket.io-client');
const { expect } = require('chai');

describe('Socket.IO server', () => {
    let clientSocket;

    before((done) => {
        clientSocket = io('http://localhost:8900');
        clientSocket.on('connect', done);
    });

    after(() => {
        clientSocket.disconnect();
    });

    it('should connect and add user', (done) => {
        const userId = 'testUser';

        clientSocket.on('getUsers', (users) => {
            const hasTestUser = users.some(user => user.userId === userId);
            expect(hasTestUser).to.be.true;
            done();
        });

        clientSocket.emit('addUser', userId);
    });

    it('should send and receive a message', function (done) {
        this.timeout(10000);
        const testMessage = {
            senderId: 'user1',
            receiverId: 'user2',
            text: 'Hello, World!',
        };

        clientSocket.on('getMessage', (message) => {
            console.log('Received message:', message);
            expect(message).to.deep.equal(testMessage);
            done();
        });

        clientSocket.on('No user found', () => {
            done(new Error('No user found'));
        });

        console.log('Sending message:', testMessage);
        clientSocket.emit('sendMessage', testMessage);

        setTimeout(done, 2000);
    });
});
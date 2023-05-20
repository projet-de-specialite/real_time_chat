const io = require("socket.io")(8900, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "https://www.piesocket.com/socketio-tester"],
        methods: ["GET", "POST"],
        allowedHeaders: ['*']
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

// Error handling middleware
io.use((socket, next) => {
    try {
        console.log(`Attempted connection from ${socket.id}`);
        next();
    } catch (error) {
        console.error(`Error during connection: ${error}`);
        next(error);
    }
});

io.on("connection", (socket) => {
    //when connect
    console.log("User is connected");
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        console.log("connection", userId);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        console.log("sockets sendMessage", user)
        if (user) { // Check if user is defined
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
        } else {
            console.log(`No user found with id: ${receiverId}`);
        }
    });
    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

io.on('error', (error) => {
    // Handle the error
    console.error(`Server-side error: ${error}`);
});

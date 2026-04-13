require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const corsOptions = {
  Credential: 'true',
  
};


const app = express();

app.use(express.json())
app.options("*" , cors(corsOptions));
app.use(cors(corsOptions));
app.use(cookieParser())


//#region // !Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http);



io.on('connection', socket => {
    SocketServer(socket);
})

//#endregion

//#region // !Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/adminRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
//#endregion


const URI = process.env.MONGODB_URL || process.env.MONGODB_URL_test || process.env.MONGO_URI;

if (!URI) {
  console.error('Missing MongoDB connection string. Set MONGODB_URL, MONGODB_URL_test, or MONGO_URI in your environment.');
  process.exit(1);
}

mongoose.connect(URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(() => {
    console.log("Database Connected!!")
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const port = process.env.PORT || 8080;
http.listen(port, () => {
  console.log("Listening on ", port);
});
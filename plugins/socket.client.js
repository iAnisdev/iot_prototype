const feathers = require("@feathersjs/feathers");
const socketio = require("@feathersjs/socketio-client");
const io = require("socket.io-client");
const socket = io("http://darmaserver.ddns.net:3131/");
const app = feathers();

export default (context, inject) => {
    // Set up Socket.io client with the socket
    app.configure(socketio(socket));
    socket.on("connect", () => {
        console.log(`%cConnected to WS server ${socket.id} `, "background-color: green; color: white; padding: 1px 2px");
        context.store.commit('SET_SOCKET_STATUS' , true)
    })
    socket.on('disconnect' , () => {
        console.log(`%Socket disconnected `, "background-color: red; color: white; padding: 1px 2px");
        context.store.commit('SET_SOCKET_STATUS' , false)
    })
    //inject plugins
    inject('app', app)
    inject('socket', socket)
    //allow it for this.$_
    context.$app = app
    context.$socket = socket
}
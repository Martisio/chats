// Importar las librerías necesarias
const express = require('express'); // Para crear el servidor web
const http = require('http'); // Para crear el servidor HTTP
const mongoose = require('mongoose'); // Para conectarse a MongoDB
const { Server } = require('socket.io'); // Para WebSockets en tiempo real

// Configurar Express y el servidor HTTP
const app = express(); // Inicia la aplicación Express
const server = http.createServer(app); // Crea un servidor HTTP con Express
const io = new Server(server); // Inicia Socket.io en el servidor

// Conectarse a MongoDB
mongoose.connect('mongodb+srv://Martisio1:uKjIeSlhfCZbMXyT@martisio.ty68o.mongodb.net/chat?retryWrites=true&w=majority&appName=Martisio');

// Definir el esquema de mensajes para la base de datos
const messageSchema = new mongoose.Schema({
    sender: String,      // Nombre de quien envía el mensaje
    content: String,     // Contenido del mensaje
    timestamp: { type: Date, default: Date.now } // Hora en que se envió el mensaje
});
const Message = mongoose.model('Message', messageSchema); // Crear el modelo de mensaje

// Configurar el servidor para manejar conexiones de WebSocket con Socket.io
io.on('connection', async (socket) => {
    console.log('Un usuario se ha conectado');

    // Cuando un usuario se conecta, enviar todos los mensajes anteriores
    const messages = await Message.find().sort({ timestamp: 1 });
    socket.emit('previousMessages', messages);

    // Escuchar los nuevos mensajes que envía el usuario
    socket.on('newMessage', async (data) => {
        const message = new Message(data); // Crear un nuevo mensaje en la base de datos
        await message.save(); // Guardar el mensaje en MongoDB

        // Enviar el mensaje a todos los usuarios conectados
        io.emit('newMessage', message);
    });

    // Cuando el usuario se desconecta
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
let editMode = false; // Controla si se está editando el mensaje en la Caja 3
let timeoutId; // Temporizador para el mensaje de la Caja 3
let countdownId; // Temporizador para la cuenta regresiva
let countdown = 3; // Tiempo inicial de la cuenta regresiva
let messageQueue = []; // Cola de mensajes pendientes de mostrar en la Caja 3
let currentSource = ''; // Origen del mensaje actual en la Caja 3
let currentPairIndex = 0; // Índice de la pareja de chat activa
let pairCount = 0; // Conteo de parejas de chat, comenzando desde la #001

// Almacenamiento de mensajes para cada pareja de chat
let chatsData = []; // Inicialmente vacío

// Función para cambiar de pareja de chat
function switchChat(pairIndex) {
    const chatContainers = document.querySelectorAll('.chat-container');
    chatContainers.forEach((container, index) => {
        container.style.display = (index === pairIndex) ? 'flex' : 'none';
    });
    currentPairIndex = pairIndex; // Actualizar la pareja de chat activa

    // Resaltar la pareja de chat seleccionada en la lista
    const chatButtons = document.querySelectorAll('.chat-list button');
    chatButtons.forEach((button, index) => {
        button.classList.toggle('selected', index === pairIndex);
    });
}

// Función para crear una nueva pareja de chat
function addChatPair() {
    const newPairIndex = pairCount++;
    const chatPairContainer = document.getElementById("chat-pair-container");

    const newChatPair = document.createElement("div");
    newChatPair.className = "chat-container";
    newChatPair.id = `chat-pair-${newPairIndex}`;
    newChatPair.style.display = "none";

    newChatPair.innerHTML = `
        <div class="chat-section">
            <div class="link-options" id="link-options-1-pair-${newPairIndex}">
                <p>¿Qué quieres vincular?</p>
                <button onclick="showLinkInput(${newPairIndex}, 1, 'whatsapp')">WhatsApp</button>
                <button onclick="showLinkInput(${newPairIndex}, 1, 'dating')">Web de citas</button>
            </div>
            <div id="link-input-container-1-pair-${newPairIndex}" class="link-input-container" style="display: none;">
                <input type="text" id="link-box-1-pair-${newPairIndex}" class="link-box" placeholder="">
                <button onclick="processLinkInput(${newPairIndex}, 1)" class="link-submit-button">Vincular</button>
            </div>
            <div id="link-message-1-pair-${newPairIndex}" class="link-message"></div>

            <input type="text" placeholder="Título Chat 1" class="chat-title" id="chat-title-1-pair-${newPairIndex}">
            <div class="chat-box" id="chat-box-1-pair-${newPairIndex}">
                <div class="typing-indicator" id="typing-indicator-1-pair-${newPairIndex}"></div>
            </div>
            <input type="text" class="message-input invisible-input" id="message-input-1-pair-${newPairIndex}" spellcheck="false">
            <button onclick="sendMessageFromBox('box1')">Enviar mensaje</button>
        </div>
        <div class="chat-section center-section">
            <div id="waiting-list-pair-${newPairIndex}" class="waiting-list"></div>
            <div class="chat-box-3" id="chat-box-3-pair-${newPairIndex}"></div>
            <div class="button-container">
                <button class="edit-button" id="edit-button-pair-${newPairIndex}" disabled>Editar mensaje</button>
                <span id="countdown-pair-${newPairIndex}" class="countdown"></span>
                <button id="mute-button-pair-${newPairIndex}" class="icon-button" onclick="toggleMute(this)">🔊</button>
            </div>
        </div>
        <div class="chat-section">
            <div class="link-options" id="link-options-2-pair-${newPairIndex}">
                <p>¿Qué quieres vincular?</p>
                <button onclick="showLinkInput(${newPairIndex}, 2, 'whatsapp')">WhatsApp</button>
                <button onclick="showLinkInput(${newPairIndex}, 2, 'dating')">Web de citas</button>
            </div>
            <div id="link-input-container-2-pair-${newPairIndex}" class="link-input-container" style="display: none;">
                <input type="text" id="link-box-2-pair-${newPairIndex}" class="link-box" placeholder="">
                <button onclick="processLinkInput(${newPairIndex}, 2)" class="link-submit-button">Vincular</button>
            </div>
            <div id="link-message-2-pair-${newPairIndex}" class="link-message"></div>

            <input type="text" placeholder="Título Chat 2" class="chat-title" id="chat-title-2-pair-${newPairIndex}">
            <div class="chat-box" id="chat-box-2-pair-${newPairIndex}">
                <div class="typing-indicator" id="typing-indicator-2-pair-${newPairIndex}"></div>
            </div>
            <input type="text" class="message-input invisible-input" id="message-input-2-pair-${newPairIndex}" spellcheck="false">
            <button onclick="sendMessageFromBox('box2')">Enviar mensaje</button>
        </div>
    `;

    chatPairContainer.appendChild(newChatPair);

    // Event listeners para las cajas de entrada de mensaje
    const inputBox1 = document.getElementById(`message-input-1-pair-${newPairIndex}`);
    const inputBox2 = document.getElementById(`message-input-2-pair-${newPairIndex}`);
    const title1 = document.getElementById(`chat-title-1-pair-${newPairIndex}`).placeholder;
    const title2 = document.getElementById(`chat-title-2-pair-${newPairIndex}`).placeholder;

    inputBox1.addEventListener('input', () => showTypingIndicator(newPairIndex, 1, title1));
    inputBox2.addEventListener('input', () => showTypingIndicator(newPairIndex, 2, title2));

    // Añadir el botón de la nueva pareja en la lista de parejas de chat
    const chatPairsButtons = document.getElementById("chat-pairs-buttons");
    const newPairButton = document.createElement("button");
    newPairButton.textContent = `Pareja #${String(newPairIndex + 1).padStart(3, '0')}`;
    newPairButton.onclick = () => switchChat(newPairIndex);
    chatPairsButtons.appendChild(newPairButton);

    // Añadir un nuevo objeto de datos de chat para la nueva pareja
    chatsData.push({ left: [], right: [] });

    // Evento de tecla Enter para los mensajes
    document.getElementById(`message-input-1-pair-${newPairIndex}`).addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessageFromBox('box1');
        }
    });
    document.getElementById(`message-input-2-pair-${newPairIndex}`).addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessageFromBox('box2');
        }
    });

    // Evento para el botón "Editar mensaje" de la nueva pareja
    document.getElementById(`edit-button-pair-${newPairIndex}`).addEventListener("click", function() {
        const chatBox3 = document.getElementById(`chat-box-3-pair-${currentPairIndex}`);
        const editButton = document.getElementById(`edit-button-pair-${currentPairIndex}`);

        if (!editMode) {
            clearTimeout(timeoutId);
            clearInterval(countdownId);
            countdown = 3;
            document.getElementById(`countdown-pair-${currentPairIndex}`).textContent = "";
            editMode = true;
            chatBox3.contentEditable = true;
            chatBox3.focus();
            editButton.textContent = "Enviar";
        } else {
            const editedMessage = chatBox3.textContent;
            chatBox3.contentEditable = false;
            editMode = false;
            editButton.textContent = "Editar mensaje";

            sendToChatFromBox3(currentPairIndex, currentSource, editedMessage);
            messageQueue.shift();
            updateWaitingList();
            chatBox3.textContent = '';
            chatBox3.style.backgroundColor = 'white';
            editButton.disabled = true;
            showMessageInBox3();
        }
    });

    // Cambiar automáticamente a la nueva pareja creada
    switchChat(newPairIndex);
}

// Función para mostrar el indicador de escritura
let typingTimeouts = {};

function showTypingIndicator(pairIndex, chatNumber) {
    const typingIndicator = document.getElementById(`typing-indicator-${chatNumber}-pair-${pairIndex}`);
    typingIndicator.innerHTML = `<strong><em>escribiendo...</em></strong>`;
    typingIndicator.style.opacity = "1"; // Hacer visible

    // Limpiar el tiempo de espera anterior si el usuario sigue escribiendo
    clearTimeout(typingTimeouts[`${pairIndex}-${chatNumber}`]);

    // Configurar un nuevo tiempo de espera para ocultar el mensaje después de 1 segundo sin actividad
    typingTimeouts[`${pairIndex}-${chatNumber}`] = setTimeout(() => {
        typingIndicator.style.opacity = "0"; // Hacer invisible
    }, 1000);
}

// Función para alternar el recuadro de enlace
function toggleLinkBox(pairIndex, chatNumber) {
    console.log(`toggleLinkBox called for pairIndex: ${pairIndex}, chatNumber: ${chatNumber}`); // Verificación
    const linkBox = document.getElementById(`link-box-${chatNumber}-pair-${pairIndex}`);
    linkBox.style.display = linkBox.style.display === "none" ? "block" : "none";
}

// Función para enviar un mensaje desde Caja 1 o Caja 2
function sendMessageFromBox(source) {
    const messageInput = document.getElementById(
        source === 'box1'
            ? `message-input-1-pair-${currentPairIndex}`
            : `message-input-2-pair-${currentPairIndex}`
    );
    const message = messageInput.value.trim();
    if (!message) return;

    // Determina quién envía el mensaje
    const sender = source === 'box1' ? 'Chat 1' : 'Chat 2';

    // Emitir el mensaje al servidor para que lo comparta en tiempo real
    socket.emit('newMessage', { sender, content: message });

    // Mostrar el mensaje en la caja de chat correspondiente
    if (source === 'box1') {
        displayMessage(currentPairIndex, 'left', message, 'message-left-blue');
        addToMessageQueue(message, 'box1', currentPairIndex); // Enviar a Caja 3 para Chat 2
    } else if (source === 'box2') {
        displayMessage(currentPairIndex, 'right', message, 'message-left-blue');
        addToMessageQueue(message, 'box2', currentPairIndex); // Enviar a Caja 3 para Chat 1
    }

    messageInput.value = ''; // Limpiar la entrada
}

// Función para añadir un mensaje a la cola de la Caja 3
function addToMessageQueue(message, source, pairIndex) {
    messageQueue.push({ text: message, source: source, pairIndex: pairIndex });
    updateWaitingList();
    if (messageQueue.length === 1 && !editMode) {
        showMessageInBox3();
    }
}

// Función para mostrar un mensaje en la Caja 3
function showMessageInBox3() {
    const chatBox3 = document.getElementById(`chat-box-3-pair-${currentPairIndex}`);
    const editButton = document.getElementById(`edit-button-pair-${currentPairIndex}`);
    const countdownDisplay = document.getElementById(`countdown-pair-${currentPairIndex}`);

    if (editMode || messageQueue.length === 0) {
        chatBox3.style.backgroundColor = 'white';
        editButton.disabled = true;
        countdownDisplay.textContent = '';
        clearInterval(countdownId);
        return;
    }

    const messageData = messageQueue[0];
    currentSource = messageData.source;
    currentPairIndex = messageData.pairIndex;
    chatBox3.textContent = messageData.text;
    chatBox3.style.backgroundColor = 'white';
    editButton.disabled = false;
    editButton.textContent = "Editar mensaje";

    countdown = 3;
    countdownDisplay.textContent = countdown;
    countdownId = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        if (countdown === 0) {
            clearInterval(countdownId);
            sendToChatFromBox3(currentPairIndex, currentSource, messageData.text);
            messageQueue.shift();
            updateWaitingList();
            chatBox3.textContent = '';
            chatBox3.style.backgroundColor = 'white';
            editButton.disabled = true;
            showMessageInBox3();
        }
    }, 1000);
}

// Función para enviar el mensaje desde la Caja 3 al chat opuesto
function sendToChatFromBox3(pairIndex, source, message) {
    const targetSide = (source === 'box1') ? 'right' : 'left';
    const targetClass = (source === 'box1') ? 'message-right-green' : 'message-right-green';
    displayMessage(pairIndex, targetSide, message, targetClass);
}

// Función para mostrar mensajes en el chat correspondiente
function displayMessage(pairIndex, side, message, styleClass) {
    const chatBox = document.getElementById(
        side === 'left' ? `chat-box-1-pair-${pairIndex}` : `chat-box-2-pair-${pairIndex}`
    );

    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = styleClass;
    chatBox.prepend(messageElement);
}

// Función para actualizar la lista de espera de la Caja 3
function updateWaitingList() {
    const waitingList = document.getElementById(`waiting-list-pair-${currentPairIndex}`);
    waitingList.innerHTML = messageQueue.slice(1).map(msg => msg.text).join('<br>');
}

// Función para alternar el estado del botón de "altavoz"
function toggleMute(button) {
    button.classList.toggle("tachado"); // Añadir o quitar clase "tachado"
    button.textContent = button.classList.contains("tachado") ? "🔇" : "🔊"; // Cambiar icono
}
function showLinkInput(pairIndex, chatNumber, linkType) {
    // Ocultar las opciones de vinculación
    const linkOptions = document.getElementById(`link-options-${chatNumber}-pair-${pairIndex}`);
    linkOptions.style.display = "none";

    // Mostrar el contenedor de entrada de enlace con el botón "Vincular"
    const linkInputContainer = document.getElementById(`link-input-container-${chatNumber}-pair-${pairIndex}`);
    linkInputContainer.style.display = "flex";

    // Cambiar el placeholder según el tipo de enlace
    const linkBox = document.getElementById(`link-box-${chatNumber}-pair-${pairIndex}`);
    if (linkType === 'whatsapp') {
        linkBox.placeholder = "Escriba el número de teléfono conectado";
    } else if (linkType === 'dating') {
        linkBox.placeholder = "Escriba el enlace del chat";
    }

    // Asignar el tipo de enlace en un atributo personalizado para usarlo en `processLinkInput`
    linkBox.dataset.linkType = linkType;

    // Manejar la entrada al pulsar "Enter"
    linkBox.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            processLinkInput(pairIndex, chatNumber);
        }
    });
}

function processLinkInput(pairIndex, chatNumber) {
    // Obtener el tipo de enlace y valor de entrada
    const linkBox = document.getElementById(`link-box-${chatNumber}-pair-${pairIndex}`);
    const linkType = linkBox.dataset.linkType;
    const inputValue = linkBox.value.trim();

    // Ocultar el recuadro de entrada
    const linkInputContainer = document.getElementById(`link-input-container-${chatNumber}-pair-${pairIndex}`);
    linkInputContainer.style.display = "none";

    // Mostrar el mensaje de vinculación
    const linkMessage = document.getElementById(`link-message-${chatNumber}-pair-${pairIndex}`);
    linkMessage.style.display = "block";

    if (linkType === 'whatsapp') {
        linkMessage.textContent = `Vinculado con ${inputValue}`;
    } else if (linkType === 'dating') {
        linkMessage.textContent = "Conectado con éxito";
    }
}

document.addEventListener('keydown', function(event) {
    // Obtener la pareja de chat activa
    const activePairIndex = currentPairIndex; // currentPairIndex debe estar definido y actualizado cuando cambias de pareja de chat

    if (event.key === 'ArrowLeft') {
        // Seleccionar Caja 1 de la pareja activa
        const inputBox1 = document.getElementById(`message-input-1-pair-${activePairIndex}`);
        inputBox1.focus();
    } else if (event.key === 'ArrowRight') {
        // Seleccionar Caja 2 de la pareja activa
        const inputBox2 = document.getElementById(`message-input-2-pair-${activePairIndex}`);
        inputBox2.focus();
    }
});

function confirmDeleteChatPair() {
    // Crear y mostrar la ventana de confirmación
    const confirmationOverlay = document.createElement('div');
    confirmationOverlay.className = 'confirmation-overlay';

    const confirmationBox = document.createElement('div');
    confirmationBox.className = 'confirmation-box';
    confirmationBox.innerHTML = `
        <p>¿Está seguro de que desea eliminar este chat?</p>
        <button class="confirm-delete-button" onclick="deleteChatPair()">Eliminar chat</button>
        <button class="cancel-delete-button" onclick="closeConfirmation()">Cancelar</button>
    `;

    confirmationOverlay.appendChild(confirmationBox);
    document.body.appendChild(confirmationOverlay);
}

function closeConfirmation() {
    // Cerrar la ventana de confirmación
    const confirmationOverlay = document.querySelector('.confirmation-overlay');
    if (confirmationOverlay) {
        confirmationOverlay.remove();
    }
}

function deleteChatPair() {
    // Seleccionar el botón correspondiente en la lista de parejas
    const chatButtonToDeactivate = document.querySelector(`#chat-pairs-buttons button:nth-child(${currentPairIndex + 1})`);
    if (chatButtonToDeactivate) {
        // Desactivar el botón y aplicar estilos de eliminación
        chatButtonToDeactivate.disabled = true;
        chatButtonToDeactivate.classList.add('disabled-chat-button');
        chatButtonToDeactivate.textContent = `Pareja #${String(currentPairIndex + 1).padStart(3, '0')} (Eliminado)`;

        // Cerrar la confirmación
        closeConfirmation();

        // Cambiar a otra pareja activa, si es posible
        const nextActiveIndex = chatsData.findIndex((_, index) => {
            return !document.querySelector(`#chat-pairs-buttons button:nth-child(${index + 1})`).disabled;
        });
        
        if (nextActiveIndex !== -1) {
            switchChat(nextActiveIndex);
        } else {
            // Si no quedan parejas activas, oculta el área de chat
            document.getElementById('chat-pair-container').style.display = 'none';
        }
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        // Cambiar a la pareja de chat anterior si existe
        if (currentPairIndex > 0) {
            switchChat(currentPairIndex - 1);
        }
    } else if (event.key === 'ArrowDown') {
        // Cambiar a la siguiente pareja de chat si existe
        if (currentPairIndex < chatsData.length - 1) {
            switchChat(currentPairIndex + 1);
        }
    }
});

function filterChatPairs() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const chatButtons = document.querySelectorAll('#chat-pairs-buttons button');

    chatButtons.forEach(button => {
        const chatName = button.textContent.toLowerCase();
        if (chatName.includes(searchInput)) {
            button.style.display = 'block'; // Muestra el botón si coincide con la búsqueda
        } else {
            button.style.display = 'none'; // Oculta el botón si no coincide
        }
    });
}

// Conectar a Socket.io desde el cliente
const socket = io('https://programachats-b6a3aa94eaac.herokuapp.com'); // URL de tu servidor en Heroku

// Mostrar los mensajes antiguos cuando el usuario se conecta
socket.on('previousMessages', (messages) => {
    messages.forEach(message => displayMessage(message.sender, message.content));
});

// Recibir y mostrar nuevos mensajes en tiempo real
socket.on('newMessage', (message) => {
    // Determina el lado donde mostrar el mensaje según el remitente
    const side = message.sender === 'Chat 1' ? 'left' : 'right';
    const styleClass = side === 'left' ? 'message-left-blue' : 'message-right-green';
    displayMessage(currentPairIndex, side, message.content, styleClass);
});


// Función para enviar mensajes
function sendMessage() {
    const content = document.getElementById('messageInput').value;
    const sender = 'Usuario'; // Puedes cambiar esto para identificar al usuario
    socket.emit('newMessage', { sender, content });
    displayMessage(sender, content); // Muestra el mensaje en el chat inmediatamente
    document.getElementById('messageInput').value = ''; // Limpiar la entrada de texto
}

// Mostrar mensaje en la página
function displayMessage(sender, content) {
    const chatBox = document.getElementById('chatBox');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${content}`;
    chatBox.appendChild(messageElement);
}

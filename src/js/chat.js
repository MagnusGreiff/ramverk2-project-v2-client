"use strict";
/* eslint-disable no-unused-vars */
const db = require('../src/js/database.js')
const cf = require('chat-functions');


let websocket;
let url;
let connect;
let sendMessage;
let message;
let close;
let output;
let connectP;
let disconnectP;
let user;
let protocol;
let loader;
let loadingText;

if (document) {
    url = document.getElementById("connect_url");
    connect = document.getElementById("connect");
    sendMessage = document.getElementById("send_message");
    message = document.getElementById("message");
    close = document.getElementById("close");
    output = document.getElementById("output");
    connectP = document.getElementById("connect_p");
    disconnectP = document.getElementById("disconnect_p");
    user = document.getElementById("user");
    protocol = document.getElementById("protocol");
    loader = document.getElementById("loader");
    loadingText = document.getElementById("loadingText");

    loader.style.display = "none";
    loadingText.style.display = "none";


    /**
     * What to do when user clicks Connect
     */
    connect.addEventListener("click", ( /*event*/ ) => {
        websocket = connectToWebsocket(url.value);


        websocket.onopen = async () => {
            loader.style.display = "block";
            loadingText.style.display = "block";
            output.style.display = "none";
            sendMessage.style.display = "none";
            message.style.display = "none";
            connectP.style.display = "none";
            output.innerHTML = '';
            /* TODO Change this*/
            let data = await db.dbGetAllData();

            let newUser = {
                name: user.value,
                type: 'newUser'
            };

            websocket.send(JSON.stringify(newUser));

            data.reverse();

            for (let item of data) {
                let text;

                // console.log(item.disconnect);

                if (item.disconnect || item.connect) {
                    await cf.outputLog(item.id + item.text, item.date, output);
                } else {
                    text = item.text;
                    if (text !== undefined) {
                        if (text.startsWith("/me")) {
                            await cf.outputLog("* " + item.id + text, item.date, output);
                        } else {
                            await cf.outputLog(item.id + " said: " + item.text, item.date, output);
                        }
                    }
                }
            }

            loader.style.display = "none";
            loadingText.style.display = "none";
            output.style.display = "block";
            sendMessage.style.display = "block";
            message.style.display = "block";
            //
            cf.outputLog("You connected to: " + url.value + " as user: " +
                user.value, null, output);
            disconnectP.style.display = "flex";
            sendText(" connected", user.value, true, false, false);
        };

        websocket.onmessage = async (event) => {
            // console.log(event);
            let parsedData = JSON.parse(event.data);
            let userList = parsedData.data;
            //
            if (userList.type == "userList") {
                document.getElementById('users').innerHTML = "";
                let users = userList.userList;
                let ul = document.createElement('ul');

                for (var i = 0; i < users.length; i++) {
                    let li = document.createElement('li');

                    li.appendChild(document.createTextNode(users[i]));
                    ul.appendChild(li);
                }
                document.getElementById('users').appendChild(ul)
            } else {
                let text = await cf.checkProtocol(event, protocol.value);

                outputToHtml(text);
            }
        };

        websocket.onclose = () => {
            closeConnection();
        };
    }, false);


    /**
     * What to do when user clicks enter to send a message.
     */
    message.addEventListener("keypress", (e) => {
        let keyCode = e.keyCode;

        if (keyCode === 13) {
            sendMessageCheck();
        }
    }, false);


    sendMessage.addEventListener("click", ( /*event*/ ) => {
        sendMessageCheck();
    });


    /**
     * What to do when user clicks Close connection.
     */
    close.addEventListener("click", ( /*event*/ ) => {
        sendText(" disconnected", user.value, false, true, false);
        console.log("Inside disconnect");
        user.value = "";
        output.innerHTML = '';
    });
};

let closeConnection = () => {
    cf.outputLog("You disconnected from server: " + url.value, null, output);
    connectP.style.display = "flex";
    disconnectP.style.display = "none";
};

let sendText = async (message, user, connecting, disconnecting, me) => {
    let msg = {
        type: "message",
        text: message,
        id: user,
        date: Date.now(),
        connect: connecting,
        disconnect: disconnecting,
        me: me
    };

    let checkForUndefined = await cf.checkText(message);
    // let newMessage = message.replace(/\//gi, "%2F").replace(/\[/gi, "%5B").replace(/\]/gi, "%5D");
    let newMessage = checkForUndefined.replace(/\</gi, "%3C").replace(/\>/gi, "%3E").replace(/\=/gi, "%3D").replace(/\'/gi, "%27").replace(/\ /gi, "%20").replace(/\_/gi, "%5F").replace(/\//gi, "%2F").replace(/\-/gi, "%2D");

    let msg2 = {
        type: "message",
        text: newMessage,
        id: user,
        date: Date.now(),
        connect: connecting,
        disconnect: disconnecting,
        me: me
    };

    if (disconnecting) {
        let disconnectedUser = {
            name: user,
            type: 'disconnectedUser'
        };

        websocket.send(JSON.stringify(disconnectedUser));
        websocket.send(JSON.stringify(msg));
        await db.dbInsertData(msg2);
        websocket.close();
        return false;
    };

    if (checkForUndefined !== undefined) {
        websocket.send(JSON.stringify(msg));
        await db.dbInsertData(msg2);
    };
};

let sendMessageCheck = () => {
    let messageText = message.value;
    let newText;

    if (!websocket || websocket.readyState === 3) {
        return false;
    } else {
        if (messageText.startsWith("/me")) {
            sendText(messageText, user.value, false, false, true);
            newText = messageText.replace("/me", "");
            message.value = '';
            cf.outputLog("* " + user.value + newText, null, output);
        } else {
            sendText(messageText, user.value, false, false, false);
            message.value = '';
            cf.outputLog(user.value + " said: " + messageText, null, output);
        }
    }
};

let connectToWebsocket = (url) => {
    if (user.value === "") {
        alert("Username is required");
        return false;
    }
    if (!protocol.value) {
        websocket = new WebSocket(url);
    } else {
        websocket = new WebSocket(url, cf.setSubProtocol(protocol.value));
    }

    return websocket;
};
//
let outputToHtml = (text) => {
    output.innerHTML += `<div class="chat_output">
     <p class="chat_message">${text}</p><br></div>`;
    output.scrollTop = output.scrollHeight;

    return text;
};

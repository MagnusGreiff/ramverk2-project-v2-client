"use strict";

const fetch = require('node-fetch');

exports.dbGetAllData = async () => {
    return await fetch('http://localhost:3000/db/getAll')
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });
};

exports.dbInsertData = async (data) => {
    data.text.replace(/\//gi, "%2F").replace(/\[/gi, "%5B").replace(/\]/gi, "%5D");
    let newData = JSON.stringify(data);

    await fetch('http://localhost:3000/db/insert/' + newData);
};

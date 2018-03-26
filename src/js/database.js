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

    data.text.replace(/\</gi, "%3C").replace(/\>/gi, "%3E").replace(/\=/gi, "%3D").replace(/\'/gi, "%27").replace(/\ /gi, "%20").replace(/\_/gi, "%5F").replace(/\//gi, "%2F").replace(/\-/gi, "%2D").replace(/\:/gi, "%3A").replace(/\./gi, "%2E").replace(/\?/gi, "%3F");

    let newData = JSON.stringify(data);

    await fetch('http://localhost:3000/db/insert/' + newData);
};

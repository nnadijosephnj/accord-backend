const { PinataSDK } = require("pinata");
require('dotenv').config();

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT || "dummy",
    pinataGateway: "gateway.pinata.cloud"
});

module.exports = pinata;

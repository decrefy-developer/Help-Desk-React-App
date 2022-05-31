import io from "socket.io-client";
const ENDPOINT = "https://help-desk-v2.herokuapp.com";
// const ENDPOINT = "ws://rdfflfi.ph/ws";

export default io(ENDPOINT);

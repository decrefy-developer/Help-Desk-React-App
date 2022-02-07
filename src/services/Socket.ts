import io from "socket.io-client";
const ENDPOINT = "ws://10.10.13.5:4041";
// const ENDPOINT = "ws://192.168.43.103:4041";

export default io(ENDPOINT);

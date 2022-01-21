import io from "socket.io-client";
const ENDPOINT = "ws://10.10.13.5:4041";

export default io(ENDPOINT);

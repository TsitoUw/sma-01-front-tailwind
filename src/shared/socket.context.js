import React from "react";
import { io } from "socket.io-client";
import { networkConfig } from "./networkConfig";

export const socket = io(networkConfig.static);
export const SocketContext = React.createContext();
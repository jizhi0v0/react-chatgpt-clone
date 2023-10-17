import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import ConversationReducer from "./conversation/ConversationReducer";
import ChatsReducer from "./chat/ChatsReducer";
import { db } from "./db/DataStore";
import {composeWithDevTools} from "redux-devtools-extension";


const store = configureStore({
    reducer: {
        conversation: ConversationReducer,
        chat: ChatsReducer
    },
    middleware: [thunk.withExtraArgument({db})],
    devTools: composeWithDevTools()
});

export default store;


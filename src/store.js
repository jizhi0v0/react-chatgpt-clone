import {configureStore} from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import ConversationReducer from "./conversation/ConversationReducer";
import ChatsReducer from "./chat/ChatsReducer";
import { db } from "./db/DataStore";
import {composeWithDevTools} from "redux-devtools-extension";
import SettingsReducer from "./settings/SettingsReducer";


const store = configureStore({
    reducer: {
        conversation: ConversationReducer,
        chat: ChatsReducer,
        setting: SettingsReducer
    },
    middleware: [thunk.withExtraArgument({db})],
    devTools: composeWithDevTools()
});

export default store;


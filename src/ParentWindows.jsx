import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { ConversationsContext, ConversationsDispatchContext } from "./conversation/ConversationContext";
import { ChatsContext, ChatsActionContext } from "./chat/ChatsContext";
import ConversationReducer from './conversation/ConversationReducer'
import ChatsReducer from "./chat/ChatsReducer";
import {useReducer} from "react";
export default function ParentWindows() {

    const [ conversations, dispatch ] = useReducer(ConversationReducer, [
        {
            conversationId: 1,
            name: "John Doe1",
        },
        {
            conversationId: 2,
            name: "John Doe2",
        },
        {
            conversationId: 3,
            name: "John Doe3",
        }
    ])

    const [ chats, chatDispatch ] = useReducer(ChatsReducer, [])

    const selectedId = conversations?.find(conversation => conversation.checked) ?
        conversations?.find(conversation => conversation.checked).conversationId :
        conversations?.[0]?.conversationId;

    const currentChats = chats?.filter(chat => chat.conversationId === selectedId);

    return (
        <div className='App'>
            <ConversationsContext.Provider value={conversations}>
                <ConversationsDispatchContext.Provider value={dispatch}>
                <Sidebar selectedId={selectedId} />
                    <ChatsContext.Provider value={currentChats}>
                        <ChatsActionContext.Provider value={chatDispatch}>
                            <Chat selectedId={selectedId}/>
                        </ChatsActionContext.Provider>
                    </ChatsContext.Provider>
                </ConversationsDispatchContext.Provider>
            </ConversationsContext.Provider>
        </div>
    )
}
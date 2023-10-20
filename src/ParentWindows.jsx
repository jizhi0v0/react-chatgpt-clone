import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { ConversationsContext } from "./conversation/ConversationContext";
import {ChatsContext, SetRenderingChatIdContext} from "./chat/ChatsContext";
import { useSelector, useDispatch } from "react-redux";
import {selectConversations, getConversations} from './conversation/ConversationReducer'
import {useEffect, useState} from "react";
import { setDefaultSettings, selectDefaultSettings} from "./settings/SettingsReducer";

export default function ParentWindows() {

    const dispatch = useDispatch();
    const conversations = useSelector(selectConversations);
    const defaultSettings = useSelector(selectDefaultSettings);
    useEffect(() => {
        dispatch(getConversations());
        console.log('setDefaultSettings')
        dispatch(setDefaultSettings())
    }, [dispatch])

    const findChecked = conversations?.find(conversation => conversation.checked);
    const selectedId: number = findChecked ?
        findChecked.conversationId :
        conversations?.[0]?.conversationId;

    const [ renderingChatId: number, setRenderingChatId ] = useState();

    return (
        <div className='App'>
            <ConversationsContext.Provider value={{conversations, defaultSettings}}>
                <SetRenderingChatIdContext.Provider value={setRenderingChatId}>
                    <ChatsContext.Provider value={{renderingChatId, selectedId}}>
                        <Sidebar/>
                        <Chat/>
                    </ChatsContext.Provider>
                </SetRenderingChatIdContext.Provider>
            </ConversationsContext.Provider>
        </div>
    )
}
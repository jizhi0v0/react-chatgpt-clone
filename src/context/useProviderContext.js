// useProvideContext.js
import React, { useState } from 'react';
import { ConversationsContext, ConversationsDispatchContext } from '../conversation/ConversationContext';
import { ChatsContext, SetRenderingChatIdContext } from '../chat/ChatsContext';

export const useProvideContext = (conversations, dispatch) => {
    const [renderingChatId, setRenderingChatId] = useState();

    return ({ children }) => (
        <div className="App">
            <ConversationsContext.Provider value={conversations}>
                <ConversationsDispatchContext.Provider value={dispatch}>
                    <SetRenderingChatIdContext.Provider value={setRenderingChatId}>
                        <ChatsContext.Provider value={{renderingChatId, selectedId: conversations?.[0]?.conversationId}}>
                            {children}
                        </ChatsContext.Provider>
                    </SetRenderingChatIdContext.Provider>
                </ConversationsDispatchContext.Provider>
            </ConversationsContext.Provider>
        </div>
    );
};

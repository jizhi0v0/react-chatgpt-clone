import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface SessionStore {
    sessions: Session;
    addConversation: (conversation: Conversation) => string;
    addHistory: (conversationId: string, histories: Array<History>) => void;
    getHistoryList: (conversationId: string) => Array<History>;
    getConversationList: () => Array<Conversation>;
}

interface Session {
    historyList: Array<ChatHistory>;
    conversationList: Array<Conversation>;
}

interface Conversation {
    showName: string;
    conversationId: string;
}

interface ChatHistory {
    conversationId: string;
    histories: Array<History>;
}

interface History {
    chatId: string;
    role: string;
    content: string;
}

export const sessionStore = create(
    persist<SessionStore>(
        (set, get) => ({
            sessions: {
                historyList: [],
                conversationList: []
            },
            addConversation: (conversation: Conversation) => {
                const newConversation: Conversation = {
                    showName: 'New Chat',
                    conversationId: uuidv4()
                }
                set((state) => ({
                    sessions: {
                        ...state.sessions,
                        conversationList: [newConversation, ...state.sessions.conversationList]
                    }
                }))
                return newConversation.conversationId;
            },
            getHistoryList: (conversationId: string) => {
                const history = get().sessions?.historyList?.find((session) => session.conversationId === conversationId);
                return history ? history.histories : [];
            },
            getConversationList: () => {
                return get().sessions.conversationList;
            },
            addHistory: (conversationId: string, histories: Array<History>) => {
                const historyList = get().sessions.historyList;
                const conversation = historyList.find((session) => session.conversationId === conversationId);
                if (conversation) {
                     conversation.histories = [...conversation.histories, ...histories];
                } else {
                    historyList.push({
                        conversationId,
                        histories
                    })
                }
                set((state) => ({
                    sessions: {
                        ...state.sessions,
                        historyList: historyList
                    }
                }))
            }
        }),
        {
            name: 'sessions-store',
            version: 1
        }
    )
)

import Dexie, { Table } from "dexie";
import {useLiveQuery} from "dexie-react-hooks";
import {v4 as uuidv4} from "uuid";

export function FetchConversations(selectedId) {
    console.log(selectedId);
    return useLiveQuery(() => db.conversations.orderBy('conversationId').reverse().toArray(), [], []);
}

export function UpdateLatestMessage(chatId: number, content: string) {
    return db.chatMessages.update(chatId, {content: content})
}

export function FetchChatMessages(conversationId: number) {
    console.log(conversationId);
    return useLiveQuery(() => {
        if (conversationId === undefined) {
            // conversationId 是 undefined，返回一个空数组
            return Promise.resolve([]);
        } else {
            // conversationId 是一个数字，执行查询
            return db.chatMessages.where('conversationId').equals(conversationId).toArray();
        }
    }, [conversationId]);
}
export interface Conversation {
    name: string;
    conversationId: number;
    checked: boolean;
}

export interface ChatMessage {
    chatId: number,
    conversationId: number,
    role: string,
    content: string,
    createdAt: string;
}

export class Chat extends Dexie {
    conversations: Table<Conversation, string>;
    chatMessages: Table<ChatMessage, string>;
    constructor() {
        super("Chat");
        this.version(1).stores({
            conversations: "++conversationId, name, checked"
        });
        this.version(1).stores({
            chatMessages: "++chatId, conversationId, role, content, createdAt"
        });
        this.chatMessages = this.table("chatMessages");
        this.conversations = this.table("conversations");
    }
}

export const db = new Chat();
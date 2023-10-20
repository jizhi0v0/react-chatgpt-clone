import Dexie, { Table } from "dexie";

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

export class Settings {
    settingId: number;
    defaultModel: string;
    apiKey: string;
}

export class Chat extends Dexie {
    conversations: Table<Conversation, number>;
    chatMessages: Table<ChatMessage, number>;
    settings: Table<Settings, number>
    constructor() {
        super("Chat");
        this.version(1).stores({
            conversations: "++conversationId, name, checked"
        });
        this.version(1).stores({
            chatMessages: "++chatId, conversationId, role, content, createdAt"
        });
        this.version(1).stores({
            settings: "++settingId, defaultModel"
        });

        this.chatMessages = this.table("chatMessages");
        this.conversations = this.table("conversations");
        this.settings = this.table("settings");
    }
}

export const db:Chat = new Chat();
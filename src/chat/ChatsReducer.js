export default function ChatsReducer(chats, action) {
    switch (action.type) {
        case 'add':
            return [...chats, ...action.payload];
        case 'update':
            console.log(action.payload);
            console.log(chats);
            return chats.map(chat => {
                if (chat.chatId === action.payload.chatId) {
                    return {
                        ...chat,
                        content: action.payload.answer
                    };
                }
                return chat;
            });
        default:
            return chats;
    }
}
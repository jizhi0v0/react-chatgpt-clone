export default function ConversationReducer(conversations, action) {
    switch (action.type) {
        case 'add': {
            const conversationId = Date.now();
            const added = [{
                name: 'new chat',
                conversationId,
                checked: true
            }, ...conversations]
            return added.map(conversation => {
                if (conversation.conversationId !== conversationId) {
                    return {
                        ...conversation,
                        checked: false
                    }
                }
                return conversation;
            })
        }
        case 'checked': {
            return conversations.map(conversation => {
                if (conversation.conversationId === action.payload) {
                    return {
                        ...conversation,
                        checked: true
                    }
                } else {
                    return {
                        ...conversation,
                        checked: false
                    }
                }
            })
        }
        default:
            return conversations;
    }

}
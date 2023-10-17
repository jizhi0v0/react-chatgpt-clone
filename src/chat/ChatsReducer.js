import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

export const sendQuestion = createAsyncThunk('chats/sendQuestion',
    async ({newChat, setRenderingChatId}, {extra: {db}}) => {
        const keys: Array<number> = await db.chatMessages.bulkAdd(newChat, {allKeys: true});
        setRenderingChatId(keys[1])
        return newChat.map((data, index) => {
            return {...data, chatId: keys[index]};
        });
    })

export const setChatList = createAsyncThunk('chat/setChatList',
    async (conversationId, {extra: {db}}) => {
        const data = await db.chatMessages.where('conversationId').equals(conversationId).toArray();
        return data;
    })

export const updateLatestChatContent = createAsyncThunk('chat/updateLatestChatContent',
    async ({chatId, content}, {extra: {db}}) => {
    console.log('update starting',chatId, content)
        await db.chatMessages.update(chatId, {content});
        return {chatId, content};
    })

const ChatsSlice = createSlice({
    name: 'chats',
    initialState: {
        chats: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendQuestion.fulfilled, (state, action) => {
                console.log('new!!!', action.payload)
                state.chats = [...state.chats, ...action.payload]
            }).addCase(setChatList.fulfilled, (state, action) => {
            state.chats = action.payload
        }).addCase(updateLatestChatContent.fulfilled, (state, {payload: {chatId, content}}) => {
            console.log('test.........')
            state.chats = state.chats.map(data => {
                if (data.chatId === chatId) {
                    return {...data, content}
                } else {
                    return data;
                }
            })
        })
    }
})


export default ChatsSlice.reducer;

export const getChatList = (state) => state.chat.chats;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const getConversationsFromDB = async (db) => {
    try {
        const data = await db.conversations.orderBy('conversationId').reverse().toArray();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}

export const getConversations = createAsyncThunk('conversations/getConversations',
    async (_, {extra: { db }}) => {
        try {
            return getConversationsFromDB(db);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            throw error;
        }
    }
)


export const addNewChat = createAsyncThunk('conversations/addNewChat',
    async (newChat, {dispatch, getState, extra: { db }}) => {
        try {
            const id = await db.conversations.add(newChat);
            await db.conversations.where('conversationId').notEqual(id).modify({checked: false});
            return getConversationsFromDB(db);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            throw error;
        }
    }
)

export const switchConversation = createAsyncThunk('conversations/switchConversation',
    async (conversationId, {extra: { db }}) => {
    try {
        await db.conversations.where('conversationId').equals(conversationId).modify({checked: true});
        await db.conversations.where('conversationId').notEqual(conversationId).modify({checked: false});
        return getConversationsFromDB(db);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
})


const conversationSlice = createSlice({
    name: 'conversations',
    initialState: {
        conversations: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getConversations.fulfilled, (state, action) => {
            state.conversations =  action.payload;
        })
        .addCase(addNewChat.fulfilled, (state, action) => {
            state.conversations =  action.payload;
        })
        .addCase(switchConversation.fulfilled, (state, action) => {
            state.conversations =  action.payload;
        })
    }
})


export const selectConversations = (state) => state.conversation.conversations;
export default conversationSlice.reducer;

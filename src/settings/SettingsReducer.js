import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { DEFAULT_MODE, OPENAI_API_KEY } from "../config/config";
import {Settings} from "../db/DataStore";

async function getDefaultSettings(db) {
    const data = await db.settings.toArray();
    console.log('data', data);
    return (data && data.length > 0) ? data[0] : null;
}

export const setDefaultSettings = createAsyncThunk("settings/setDefaultSettings",
    async (_, {extra: {db}}) => {
        const data = await getDefaultSettings(db);
        if (!data) {
            const key = await db.settings.add(defaultSettings());
            return {...defaultSettings(), settingId: key};
        } else {
            return data;
        }
    })

export const updateDefaultSettings = createAsyncThunk('seetings/updateDefaultSettings',
    async (updateInfo, {extra: {db}, getState}) => {
    console.log(updateInfo)
        await db.settings.update(getState().setting.settings.settingId, updateInfo);
        return await getDefaultSettings(db);
    })

const defaultSettings = (): {defaultSettings: Settings} => {
    return {
        defaultModel: DEFAULT_MODE ? DEFAULT_MODE : 'gpt-3.5-turbo',
        apiKey: OPENAI_API_KEY ? OPENAI_API_KEY : '',
    }
}

const SettingsSlice = createSlice({
    name: "settings",
    initialState: {
        settings: {}
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(setDefaultSettings.pending, (state, action) => {
            console.log('pending')
        }).addCase(setDefaultSettings.rejected, (state, action) => {
            console.log('rejected', state, action)
        }).addCase(setDefaultSettings.fulfilled, (state, action) => {
            state.settings = action.payload
        }).addCase(updateDefaultSettings.fulfilled, (state, action) => {
            state.settings = action.payload
        }).addCase(updateDefaultSettings.rejected, (state, action) => {
            console.log(state, action)
        })
    }
})

export default SettingsSlice.reducer;
export const selectDefaultSettings = (state) => state.setting.settings;
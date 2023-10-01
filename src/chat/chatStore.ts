import {create} from 'zustand';
import {persist} from 'zustand/middleware';

interface TitleStore {
    titles: Array<Title>;
    add: (title: Title) => void;
}

interface Title {
    title: string;
    uuid: string;
}

export const useStore = create(
    persist<TitleStore>(
        (set, get) => ({
            titles: [],
            add: (title: Title) => {
                set((state) => ({titles: [title, ...state.titles]}))
            }
        }),
        {
            name: 'title-store',
            version: 1
        }
    )
)

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface SessionStore {
    sessions: Array<Session>;
    add: (session: Session) => void;
}

interface Session {
    sessionName: string;
    sessionId: string;
}

export const sessionStore = create(
    persist<SessionStore>(
        (set, get) => ({
            sessions: [],
            add: (session: Session) => {
                const newSession: Session = {
                    sessionName: 'New Chat',
                    sessionId: uuidv4(),
                }
                set((state) => ({sessions: [newSession, ...state.sessions]}))
            }
        }),
        {
            name: 'sessions-store',
            version: 1
        }
    )
)

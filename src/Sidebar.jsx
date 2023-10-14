import React from 'react';
import { useContext } from "react";
import {ConversationsContext, ConversationsDispatchContext} from "./conversation/ConversationContext";

export default function Sidebar(props) {

    const conversations = useContext(ConversationsContext);
    const dispatch = useContext(ConversationsDispatchContext);

    return (
        <section className="side-bar">
            <button onClick={() => {
                dispatch({
                    type: 'add'
                })
            }}>New Chat</button>
            <ul className="history">
                {conversations?.map((conversation, index) => {
                    return <li style={{color: props.selectedId === conversation.conversationId && 'orange'}} onClick={() => {
                        dispatch({
                            type: 'checked',
                            payload: conversation.conversationId
                        })
                    }} key={index}>{conversation.name}</li>
                })}
            </ul>
            <nav>
                <p>Made by Bobby</p>
            </nav>
        </section>
    );
}


import React, {useState} from "react";
import "./index.css";
import {v4 as uuidv4} from 'uuid';
import useAutoScroll from './util/useAutoScroll';
import UserInput from './UserInput.jsx';
import {useContext} from "react";
import {ChatsContext, ChatsActionContext} from "./chat/ChatsContext";


export default function Chat(props) {

    const [inputValue, setInputValue] = useState("")
    const [sectionRef] = useAutoScroll();
    const chats = useContext(ChatsContext);
    const action = useContext(ChatsActionContext);
    const answerChatId = chats.length > 0 ? chats[chats.length - 1].chatId : null;
    const sendQuestion = () => {
        action({
            type: 'add',
            payload: [{
                chatId: uuidv4(),
                conversationId: props.selectedId,
                role: 'user',
                content: inputValue,
                createdAt: new Date().toISOString()
            }, {
                chatId: uuidv4(),
                conversationId: props.selectedId,
                role: 'bot',
                content: 'Loading...',
                createdAt: new Date().toISOString()
            }]
        })
    }

    return (
        <section className="main">
            {chats.length === 0 && <h1>Bobby GPT</h1>}
            <ul className="feed" ref={sectionRef}>
                {chats.map((item, index) => {
                    return <li key={index}>
                        <p className="role">
                            {item.role}
                        </p>
                        <p className="content">
                            {item.content}
                        </p>
                    </li>
                })}
            </ul>
            <UserInput sendQuestion={sendQuestion} inputVaule={inputValue} setInputVaule={setInputValue}
                       answerChatId={answerChatId}/>
        </section>
    );
}
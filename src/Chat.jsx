import React, {useEffect} from "react";
import "./index.css";
import useAutoScroll from './util/useAutoScroll';
import UserInput from './UserInput.jsx';
import {useContext} from "react";
import {ChatsContext} from "./chat/ChatsContext";
import {useSelector, useDispatch} from "react-redux";
import {getChatList, setChatList} from "./chat/ChatsReducer";

export default function Chat(props) {

    const [sectionRef] = useAutoScroll();

    const dispatch = useDispatch();
    const chatList = useSelector(getChatList)

    const {selectedId} = useContext(ChatsContext);

    useEffect(() => {
        dispatch(setChatList(selectedId));
    }, [dispatch, selectedId])



    return (
        <section className="main">
            {chatList?.length === 0 && <h1>Bobby GPT</h1>}
            <ul className="feed" ref={sectionRef}>
                {chatList?.map((item, index) => {
                    return <li key={item.chatId}>
                        <p className="role">
                            {item.role}
                        </p>
                        <p className="content">
                            {item.content}
                        </p>
                    </li>
                })}
            </ul>
            <UserInput/>
        </section>
    );
}
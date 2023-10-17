import React, {useState} from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import { useContext } from "react";
import {ChatsContext, SetRenderingChatIdContext} from "./chat/ChatsContext";
import { useDispatch } from "react-redux";
import {sendQuestion as doChat, updateLatestChatContent} from "./chat/ChatsReducer";
import { OPENAI_API_KEY} from "./config/config";

export default function UserInput() {

    const [inputValue, setInputValue] = useState("")

    const { renderingChatId, selectedId } = useContext(ChatsContext);
    const setRenderingChatId = useContext(SetRenderingChatIdContext)

    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!renderingChatId) {
            return;
        }
        const question = inputValue;
        setInputValue("")
        let answer = '';
        fetchEventSource('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + OPENAI_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{"role": "user", "content": question}],
                stream: true,
            }),
            onmessage(event) {
                if (event.data === '[DONE]') {
                    console.log('stop');
                    return;
                }
                const data = JSON.parse(event.data)
                answer += data.choices[0]?.delta?.content || '';
                dispatch(updateLatestChatContent({
                    chatId: renderingChatId,
                    content: answer
                }))
            },
            onclose() {
                console.log('close');
            },
            onerror(error) {
                console.log('error', error);
            },
            onopen() {
                console.log('open');
            }

        });
    }, [renderingChatId]);


    const sendQuestion = () => {
        dispatch(doChat({
            newChat:
                [
                    {
                        conversationId: selectedId,
                        role: 'user',
                        content: inputValue,
                        createdAt: new Date().toISOString()
                    }, {
                    conversationId: selectedId,
                    role: 'bot',
                    content: 'Loading...',
                    createdAt: new Date().toISOString()
                }
                ], setRenderingChatId: setRenderingChatId
        }))
    }

    function handleKeyDown(e) {
        if (e.keyCode === 13) {
            sendQuestion();
        }
    }

    return (
        <div className="bottom-section">
            <div className="input-container">
                <input onKeyDown={(e) => handleKeyDown(e)} value={inputValue} onChange={(e) => {
                    setInputValue(e.target.value);
                }}/>
                <div id="submit" onClick={sendQuestion}>➢</div>
            </div>
            <p className="info">
                Chat GPT Mar 14 Version . Free Research Preview .
                Our goal is to make AI systems more natural and safe to interact with .
                Your feedback will help us improve .
            </p>
        </div>
    )
}

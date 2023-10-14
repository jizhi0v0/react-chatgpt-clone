import React from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import { useContext } from "react";
import { ChatsActionContext} from "./chat/ChatsContext";

export default function UserInput({inputVaule, setInputVaule, sendQuestion, answerChatId}) {

    const action = useContext(ChatsActionContext)
    const chatIdRef = React.useRef(answerChatId);

    // 使用 useEffect 来更新 chatIdRef.current 的值
    React.useEffect(() => {
        chatIdRef.current = answerChatId;
    }, [answerChatId]);

    const handleClick = ()=> {
        sendQuestion();
        let answer = '';
        fetchEventSource('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.REACT_APP_API_KEY
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{"role": "user", "content": inputVaule}],
                stream: true,
            }),
            onmessage(event) {
                if (event.data === '[DONE]') {
                    console.log('stop');
                    return;
                }
                const data = JSON.parse(event.data)
                answer += data.choices[0]?.delta?.content || '';
                action({
                    type: 'update',
                    payload: {
                        answer: answer,
                        chatId: chatIdRef.current
                    }
                })
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
    }

    return (
        <div className="bottom-section">
            <div className="input-container">
                <input value={inputVaule} onChange={(e) => {
                    setInputVaule(e.target.value);
                }}/>
                <div id="submit" onClick={handleClick}>➢</div>
            </div>
            <p className="info">
                Chat GPT Mar 14 Version . Free Research Preview .
                Our goal is to make AI systems more natural and safe to interact with .
                Your feedback will help us improve .
            </p>
        </div>
    )
}

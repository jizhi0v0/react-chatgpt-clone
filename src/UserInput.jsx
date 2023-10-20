import React, {useState} from "react";
import { useContext } from "react";
import {ChatsContext, SetRenderingChatIdContext} from "./chat/ChatsContext";
import { useDispatch } from "react-redux";
import {sendQuestion as doChat, updateLatestChatContent} from "./chat/ChatsReducer";
import {Button} from "react-bootstrap";

export default function UserInput() {

    const [inputValue, setInputValue] = useState("")

    const { renderingChatId, selectedId } = useContext(ChatsContext);
    const setRenderingChatId = useContext(SetRenderingChatIdContext)

    const dispatch = useDispatch();

    let source;
    React.useEffect(() => {
        if (!renderingChatId) {
            if (source) {
                console.log('close')
                source.close();
            }
            return;
        }
        const question = inputValue;
        setInputValue("")

        source = new EventSource('http://127.0.0.1:8844/stream?question=' + question);
        let answer = '';

        source.addEventListener('message', function (e) {
            if (e.data) {
                if (e.data === 'end') {
                    source.close();
                    setRenderingChatId(null);
                    return;
                }
                answer += e.data;
                console.log(answer);
                dispatch(updateLatestChatContent({
                    chatId: renderingChatId,
                    content: answer
                }))
            }
        });

        source.addEventListener('open', function (e) {
            console.log('open');
        });


        source.addEventListener('error', function (e) {
            if (e.readyState == EventSource.CLOSED) {
                console.log('close');
            }
        });

        return () => {
            source.close();
        }
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

    const handleStop = () => {
        setRenderingChatId(null);
    }

    return (
        <div className="bottom-section">
            {renderingChatId && <Button style={{marginBottom: '15px'}} onClick={handleStop} variant="outline-light">STOP</Button>}

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

import React, {useState, useEffect, useRef} from 'react';
import {sessionStore} from './chat/sessionStore.ts'

const App = () => {

    // 保存输入框的值
    const [value, setValue] = useState('')
    // 存储答案
    const [answer, setAnswer] = useState('')
    // 存储问题
    const [question, setQuestion] = useState('')
    // 存储历史聊天
    const [previousChats, setPreviousChats] = useState([])
    const [currentSessionId, setCurrentSessionId] = useState('')
    // 存储所有会话标题
    const sessions = sessionStore(state => state.sessions);
    const addSession  = sessionStore(state => state.add);

    // 存储当前请求状态：start loading done
    const [requestStatus, setRequestStatus] = useState('')
    // 存储滚动状态
    const [autoScroll, setAutoScroll] = useState(true);
    const [abortController, setAbortController] = useState(null);

    const newChat = () => {
        setRequestStatus('abort')
        setPreviousChats([])
        addSession('New Chat')
    }
    const stop = () => {
        setRequestStatus('abort')
    }

    const sendQuestion = async () => {
        setRequestStatus('start')

        const abortController = new AbortController();
        abortController.signal.onabort = () => {
            console.log('Fetch aborted');
        };
        const {signal} = abortController.signal;
        setAbortController(abortController)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: value
            }),
            signal
        }
        try {
            await fetch('http://localhost:8000/completions', options)
                .then(response => {
                    const reader = response.body.getReader();
                    let data = '';

                    function read() {
                        reader.read().then(({done, value}) => {
                            if (done) {
                                setRequestStatus('done')
                                return;
                            }

                            // 处理每次读取的数据
                            const textDecoder = new TextDecoder();
                            data += textDecoder.decode(value);
                            setAnswer(data)
                            read();
                        });
                    }

                    setRequestStatus('loading')
                    read();
                }).catch(error => {

                    console.error('Error:', error);
                });
        } catch (e) {
            console.log(e)
        }
    }

    const currentChat = previousChats.filter(chat =>
        chat.sessionId === currentSessionId
    )

    const switchCurrentChat = (sessionId) => {
        setCurrentSessionId(sessionId)
        setValue('')
    }

    function handleKeyUp(event) {
        if (event.keyCode === 13) {
            sendQuestion();
        }
    }

    useEffect(() => {
        if (requestStatus === 'start') {
            setQuestion(value)
            if (!currentSessionId) {
                addSession()
            }
            setPreviousChats([
                ...previousChats,
                {
                    sessionId: currentSessionId,
                    role: "user",
                    content: question
                },
                {
                    sessionId: currentSessionId,
                    role: "assistant",
                    content: 'loading...'
                }
            ])
            setValue('')
        } else if (requestStatus === 'loading' && answer) {

            const updatedChats = previousChats.map((chat, index) => {
                if (index === previousChats.length - 1) {
                    return {...chat, content: answer};
                }
                return chat;
            });
            setPreviousChats(updatedChats)
        } else if (requestStatus === 'abort') {
            abortController?.abort();
            setRequestStatus('')
        }

    }, [answer, requestStatus, currentSessionId])

    const sectionRef = useRef(null);

    function scrollDomToBottom() {
        const dom = sectionRef.current;
        if (dom) {
            requestAnimationFrame(() => {
                setAutoScroll(true);
                dom.scrollTo(0, dom.scrollHeight);
            });
        }
    }

    useEffect(() => {
        if (autoScroll) {
            scrollDomToBottom();
        }
    });

    return (
        <div className="App">
            <section className="side-bar">
                <button onClick={newChat}> + New Chat</button>
                <ul className="history">
                    {sessions && [...sessions].map((session, index) =>
                        <li
                        style={{color: (currentSessionId === session.sessionId) ? 'coral' : ''}} key={index}
                        onClick={() => switchCurrentChat(session.sessionId)}>
                        {session.sessionName}
                    </li>)}
                </ul>
                <nav>
                    <p>Made by Bobby</p>
                </nav>
            </section>
            <section className="main">
                {!currentSessionId && <h1>Bobby GPT</h1>}
                <ul className="feed" ref={sectionRef}>
                    {currentChat?.map((chat, index) => <li key={index}>
                        <p className="role">
                            {chat.role}
                        </p>
                        <p className="content">
                            {chat.content}
                        </p>
                    </li>)}
                </ul>
                {requestStatus === 'loading' && <button onClick={stop}>Stop</button>}
                <div className="bottom-section">
                    <div className="input-container">
                        <input value={value} onChange={(e) => {
                            setValue(e.target.value);
                            setQuestion(e.target.value)
                        }} onKeyUp={(event) => handleKeyUp(event)}/>
                        <div id="submit" onClick={sendQuestion}>➢</div>
                    </div>
                    <p className="info">
                        Chat GPT Mar 14 Version . Free Research Preview .
                        Our goal is to make AI systems more natural and safe to interact with .
                        Your feedback will help us improve .
                    </p>
                </div>
            </section>
        </div>
    );
}

export default App;

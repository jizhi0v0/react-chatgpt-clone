import { useState, useRef, useEffect } from 'react';

function useAutoScroll() {
    const [autoScroll, setAutoScroll] = useState(true);
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

    return [sectionRef, autoScroll, setAutoScroll];
}

export default useAutoScroll;

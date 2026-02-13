import React, { useState, useRef, useEffect } from 'react';
import { chatWithQwalt } from '../services/geminiService';
import './Chatbot.css';

const QWALT_ICON = '/qwalt-mascot.png';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    time: string;
}

const QUICK_QUESTIONS = [
    "What is DAC?",
    "Upcoming events?",
    "How to join?",
    "Who leads the club?",
];

const WELCOME_MSG: Message = {
    id: 'welcome',
    text: "Hey there! I'm Qwalt, the Data Analytics Club's AI assistant. Ask me anything about our club, events, team, or how to get involved!",
    sender: 'bot',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 350);
        }
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
        setShowBadge(false);
        setIsClosing(false);
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, 250);
    };

    const sendMessage = async (text: string) => {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            text: text.trim(),
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            // Build conversation history for context
            const history = messages
                .filter(m => m.id !== 'welcome')
                .map(m => `${m.sender === 'user' ? 'User' : 'Qwalt'}: ${m.text}`)
                .join('\n');

            const response = await chatWithQwalt(text.trim(), history);

            const botMsg: Message = {
                id: `bot-${Date.now()}`,
                text: response,
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setMessages(prev => [...prev, botMsg]);
        } catch {
            const errorMsg: Message = {
                id: `err-${Date.now()}`,
                text: "Oops! I couldn't process that. Please try again.",
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleQuickAction = (question: string) => {
        sendMessage(question);
    };

    return (
        <>
            {/* Floating Bubble */}
            <div
                className={`qwalt-bubble ${isOpen ? 'open' : ''}`}
                onClick={handleOpen}
                title="Chat with Qwalt"
            >
                <img src={QWALT_ICON} alt="Qwalt" />
                {showBadge && <span className="qwalt-badge">1</span>}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className={`qwalt-window ${isClosing ? 'closing' : ''}`}>
                    {/* Header */}
                    <div className="qwalt-header">
                        <img src={QWALT_ICON} alt="Qwalt" className="qwalt-header-avatar" />
                        <div className="qwalt-header-info">
                            <div className="qwalt-header-name">Qwalt</div>
                            <div className="qwalt-header-status">DAC AI Assistant</div>
                        </div>
                        <button className="qwalt-close-btn" onClick={handleClose}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="qwalt-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`qwalt-msg ${msg.sender}`}>
                                {msg.text}
                                <div className="qwalt-msg-time">{msg.time}</div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="qwalt-typing">
                                <div className="qwalt-typing-dot" />
                                <div className="qwalt-typing-dot" />
                                <div className="qwalt-typing-dot" />
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions (only show if few messages) */}
                    {messages.length <= 2 && !isTyping && (
                        <div className="qwalt-quick-actions">
                            {QUICK_QUESTIONS.map(q => (
                                <button
                                    key={q}
                                    className="qwalt-quick-btn"
                                    onClick={() => handleQuickAction(q)}
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form className="qwalt-input-area" onSubmit={handleSubmit}>
                        <input
                            ref={inputRef}
                            className="qwalt-input"
                            type="text"
                            placeholder="Ask Qwalt anything..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={isTyping}
                        />
                        <button
                            className="qwalt-send-btn"
                            type="submit"
                            disabled={!input.trim() || isTyping}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;

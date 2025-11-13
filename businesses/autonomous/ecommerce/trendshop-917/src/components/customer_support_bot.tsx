// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect, useRef } from 'react';

// Mock Knowledge Base (replace with actual API calls)
const knowledgeBase = {
    "where is my order": "Your order is currently being processed and is expected to ship within 24 hours. You can track it here: [Tracking Link]",
    "return policy": "Our return policy allows for returns within 30 days of purchase. Please visit our returns portal: [Returns Portal]",
    "damaged item": "We're sorry to hear that your item arrived damaged. Please contact us with photos of the damage and your order number, and we'll assist you.",
    "default": "I'm sorry, I don't understand. Please try rephrasing your question or contact our support team directly."
};

interface Message {
    text: string;
    isUser: boolean;
}

const CustomerSupportBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom of chat on new messages
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        try {
            if (inputText.trim() !== '') {
                setMessages([...messages, { text: inputText, isUser: true }]);
                const response = processUserMessage(inputText);
                setMessages([...messages, { text: inputText, isUser: true }, { text: response, isUser: false }]);
                setInputText('');
            }
        } catch (error: any) {
            console.error("Error sending message:", error);
            setMessages([...messages, { text: inputText, isUser: true }, { text: "Sorry, there was an error processing your request.", isUser: false }]);
        }
    };

    const processUserMessage = (message: string): string => {
        const lowerCaseMessage = message.toLowerCase();
        if (knowledgeBase[lowerCaseMessage]) {
            return knowledgeBase[lowerCaseMessage];
        } else {
            return knowledgeBase["default"];
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '300px', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.isUser ? 'right' : 'left', marginBottom: '5px' }}>
                        <strong>{message.isUser ? 'You:' : 'Bot:'}</strong> {message.text}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex' }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{ flex: 1, marginRight: '5px' }}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default CustomerSupportBot;

// src/components/CustomerSupportBot.tsx
import React, { useState, useEffect, useRef } from 'react';

// Mock Knowledge Base (replace with actual API calls)
const knowledgeBase = {
    "where is my order": "Your order is currently being processed and is expected to ship within 24 hours. You can track it here: [Tracking Link]",
    "return policy": "Our return policy allows for returns within 30 days of purchase. Please visit our returns portal: [Returns Portal]",
    "damaged item": "We're sorry to hear that your item arrived damaged. Please contact us with photos of the damage and your order number, and we'll assist you.",
    "default": "I'm sorry, I don't understand. Please try rephrasing your question or contact our support team directly."
};

interface Message {
    text: string;
    isUser: boolean;
}

const CustomerSupportBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom of chat on new messages
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        try {
            if (inputText.trim() !== '') {
                setMessages([...messages, { text: inputText, isUser: true }]);
                const response = processUserMessage(inputText);
                setMessages([...messages, { text: inputText, isUser: true }, { text: response, isUser: false }]);
                setInputText('');
            }
        } catch (error: any) {
            console.error("Error sending message:", error);
            setMessages([...messages, { text: inputText, isUser: true }, { text: "Sorry, there was an error processing your request.", isUser: false }]);
        }
    };

    const processUserMessage = (message: string): string => {
        const lowerCaseMessage = message.toLowerCase();
        if (knowledgeBase[lowerCaseMessage]) {
            return knowledgeBase[lowerCaseMessage];
        } else {
            return knowledgeBase["default"];
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '300px', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div ref={chatContainerRef} style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.isUser ? 'right' : 'left', marginBottom: '5px' }}>
                        <strong>{message.isUser ? 'You:' : 'Bot:'}</strong> {message.text}
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex' }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{ flex: 1, marginRight: '5px' }}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default CustomerSupportBot;
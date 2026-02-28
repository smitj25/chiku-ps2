import { useState, useCallback } from 'react';
import { queryPipeline } from '../api';

export function useChat() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (text, personaId, compareMode = false) => {
        setError(null);

        // Add user message
        const userMsg = { role: 'user', text, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const data = await queryPipeline(text, personaId, compareMode);

            // Determine if comparison mode
            if (data.vanilla_response !== undefined) {
                // Comparison response
                const assistantMsg = {
                    role: 'comparison',
                    vanilla: data.vanilla_response,
                    vanilla_duration_ms: data.vanilla_duration_ms,
                    smeplug: data.smeplug_response,
                    timestamp: Date.now(),
                };
                setMessages(prev => [...prev, assistantMsg]);
            } else {
                // Normal response
                const assistantMsg = {
                    role: 'assistant',
                    data,
                    timestamp: Date.now(),
                };
                setMessages(prev => [...prev, assistantMsg]);
            }
        } catch (err) {
            setError(err.message);
            const errorMsg = {
                role: 'error',
                text: err.message,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return { messages, loading, error, sendMessage, clearMessages };
}

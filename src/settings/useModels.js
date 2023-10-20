import { useState, useEffect, useCallback } from 'react';
import OpenAI from 'openai';

export function useModels(apiKey, isOpen) {
    const [models, setModels] = useState([]);

    const getModels = useCallback(async () => {
        try {
            const openai = new OpenAI({
                apiKey: apiKey,
                dangerouslyAllowBrowser: true,
            });

            return openai.models.list({});
        } catch (error) {
            console.error('Failed to get models:', error);
        }
    }, [apiKey]);

    useEffect(() => {
        if (isOpen) {
            getModels().then((result) => {
                setModels(result['data'].filter((model) => model.owned_by === 'openai' && model.id.startsWith('gpt')));
            });
        }
    }, [isOpen, getModels]);

    return models;
}

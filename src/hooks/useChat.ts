import { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { mockSchools } from '../data/mockData';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Bonjour ! Je suis votre assistant pour vous aider à trouver des établissements scolaires au Sénégal. Comment puis-je vous aider ?',
      timestamp: new Date().toISOString(),
      suggestions: [
        'Trouver une école primaire à Dakar',
        'Comparer des lycées',
        'Établissements avec cantine',
        'Meilleures universités'
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000));

    let botResponse = '';
    let suggestions: string[] = [];

    // Simple keyword matching for demo
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('école') || lowerContent.includes('primaire')) {
      const primarySchools = mockSchools.filter(s => s.type === 'primary');
      botResponse = `J'ai trouvé ${primarySchools.length} écoles primaires. Voici les mieux notées : ${primarySchools.slice(0, 3).map(s => s.name).join(', ')}.`;
      suggestions = ['Voir sur la carte', 'Plus de détails', 'Écoles avec cantine'];
    } else if (lowerContent.includes('lycée') || lowerContent.includes('secondaire')) {
      const highSchools = mockSchools.filter(s => s.type === 'high_school');
      botResponse = `Il y a ${highSchools.length} lycées disponibles. Les mieux notés sont : ${highSchools.slice(0, 2).map(s => s.name).join(', ')}.`;
      suggestions = ['Comparer les lycées', 'Résultats au bac', 'Frais de scolarité'];
    } else if (lowerContent.includes('dakar')) {
      const dakarSchools = mockSchools.filter(s => s.region === 'Dakar');
      botResponse = `À Dakar, nous avons ${dakarSchools.length} établissements répertoriés dans notre base de données.`;
      suggestions = ['Voir la carte de Dakar', 'Meilleurs établissements', 'Transport scolaire'];
    } else {
      botResponse = 'Je peux vous aider à trouver des établissements scolaires, comparer leurs services, ou vous donner des informations sur une région spécifique. Que souhaitez-vous savoir ?';
      suggestions = [
        'Établissements par région',
        'Écoles avec internat',
        'Frais de scolarité',
        'Activités extrascolaires'
      ];
    }

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date().toISOString(),
      suggestions
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage
  };
};
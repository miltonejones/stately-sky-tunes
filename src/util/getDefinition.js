
import { generateText } from './generateText'; 

export const getDefinition = async (term) => { 
  const curatedInstructions = `what language and dialect does this refer to "${term}". Limit your response to 64 tokens.`
 
  const create = (content) => ([{ role: 'user', content }]);
  const definition = await generateText(create(curatedInstructions), 1, 64);  
  const { choices } = definition; 

  // If no choices exist, return false.
  if (!choices?.length) {
    return false;
  }

  // Parse introduction from first message in choices.
  const { message } = choices[0];  
  return message.content;
};


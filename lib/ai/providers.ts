

import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

import {createGoogleGenerativeAI} from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

 

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    }):customProvider({
      languageModels: {
        'chat-model': groq('deepseek-r1-distill-llama-70b"'),
        'chat-model-reasoning': wrapLanguageModel({
          model: groq('deepseek-r1-distill-llama-70b'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': google('gemini-2.0-flash'),
        'artifact-model': google('gemini-2.0-flash'),
      },
      imageModels: {
        // 'small-model': xai.image('grok-2-image'),
      },
    });
  // : customProvider({
  //     languageModels: {
  //       'chat-model': google('gemini-2.0-flash'),
  //       'chat-model-reasoning': wrapLanguageModel({
  //         model: google('gemini-2.0-flash-thinking-exp-01-21'),
  //         middleware: extractReasoningMiddleware({ tagName: 'think' }),
  //       }),
  //       'title-model': google('gemini-2.0-flash'),
  //       'artifact-model': google('gemini-2.0-flash'),
  //     },
  //     imageModels: {
  //       // 'small-model': xai.image('grok-2-image'),
  //     },
  //   });

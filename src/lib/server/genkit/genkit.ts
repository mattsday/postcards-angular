import { genkit, z } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';
import {
  PostcardResponse,
} from '../../schema/postcard-request';
import { renderMap } from '../maps/map-image';
import { PostcardRequestSchema, PostcardResponseSchema, PostcardDescriptionStoryRequestSchema, PostcardDescriptionStoryResponseSchema, PostcardImageRequestSchema } from './schema';

const project = process.env['PROJECT_ID'];

if (!project) {
  throw new Error('PROJECT_ID is not set');
}

export const ai = genkit({
  plugins: [vertexAI({ projectId: project, location: 'europe-west1' })],
  promptDir: 'lib/server/genkit/prompts',
});

export const postcardFlow = ai.defineFlow(
  {
    name: 'Generate a Postcard',
    inputSchema: PostcardRequestSchema,
    outputSchema: PostcardResponseSchema,
  },
  async (postcard) => {
    const mapImage = await renderMap(postcard.start, postcard.end);
    const mapUrl = `data:image/png;base64,${mapImage}`;

    const mapPrompt = ai.prompt<
      typeof PostcardDescriptionStoryRequestSchema, // Input schema
      typeof PostcardDescriptionStoryResponseSchema, // Output schema
      z.ZodTypeAny // Custom options schema
    >('postcard-map');

    const imagePrompt = ai.prompt<
      typeof PostcardImageRequestSchema, // Input schema
      z.ZodTypeAny // Custom options schema
    >('postcard-image');

    const mapResponse = await mapPrompt({
      start: postcard.start,
      end: postcard.end,
      sender: postcard.sender,
      recipient: postcard.recipient,
    });

    if (!mapResponse.output?.story) {
      throw new Error("Story not generated");
    }

    const imageResponse = await imagePrompt({
      start: postcard.start,
      end: postcard.end,
      story: mapResponse.output?.story,
    });


    return {
      description: mapResponse.output?.description,
      story: mapResponse.output?.story,
      image: imageResponse.media?.url,
      map: mapUrl,
    } as PostcardResponse;
  }
);

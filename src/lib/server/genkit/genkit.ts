import { genkit, z } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';
import { PostcardResponse } from '../../schema/postcard-request';
import { renderMap } from '../maps/map-image';

const project = process.env['PROJECT_ID'];

if (!project) {
  throw new Error('PROJECT_ID is not set');
}

export const ai = genkit({
  plugins: [vertexAI({ projectId: project, location: 'europe-west1' })],
  promptDir: 'src/lib/server/genkit/prompts',
});

// TODO - not sure why I can't put these in a separate file, but compilation fails if I do

// Used by the client and flow as the input schema for Genkit
export const PostcardRequestSchema = ai.defineSchema(
  'PostcardRequestSchema',
  z.object({
    start: z.string(),
    end: z.string(),
    sender: z.string(),
    recipient: z.string(),
  })
);

// Sent back to the client
export const PostcardResponseSchema = ai.defineSchema(
  'PostcardResponseSchema',
  z.object({
    description: z.string(),
    image: z.string(),
    map: z.string(),
    story: z.string(),
  })
);

// Used by Gemini to create the description & story
export const PostcardDescriptionStoryRequestSchema = ai.defineSchema(
  'PostcardDescriptionStoryRequestSchema',
  z.object({
    start: z.string(),
    end: z.string(),
    mapImage: z.string(),
    sender: z.string(),
    recipient: z.string(),
  })
);
export type PostcardDescriptionStoryRequest = z.infer<
  typeof PostcardDescriptionStoryRequestSchema
>;

// The output from this LLM step
export const PostcardDescriptionStoryResponseSchema = ai.defineSchema(
  'PostcardDescriptionStoryResponseSchema',
  z.object({
    description: z.string(),
    story: z.string(),
  })
);
export type PostcardDescriptionStoryResponse = z.infer<
  typeof PostcardDescriptionStoryResponseSchema
>;

// Used by Imagen3 to create the postcard image
export const PostcardImageRequestSchema = ai.defineSchema(
  'PostcardImageRequestSchema',
  z.object({
    start: z.string(),
    end: z.string(),
    story: z.string(),
  })
);
export type PostcardImageRequest = z.infer<typeof PostcardImageRequestSchema>;

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
      mapImage: mapUrl,
    });


    if (!mapResponse.output?.story) {
      throw new Error('Story not generated');
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

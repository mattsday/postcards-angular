import { z } from 'genkit';
import { ai } from './genkit';

// Used by the client and flow as the input schema for Genkit
export const PostcardRequestSchema = ai.defineSchema(
  'PostcardRequest',
  z.object({
    start: z.string(),
    end: z.string(),
    sender: z.string(),
    recipient: z.string(),
  })
);

// Sent back to the client
export const PostcardResponseSchema = ai.defineSchema(
  'PostcardResponse',
  z.object({
    description: z.string(),
    image: z.string(),
    map: z.string(),
    story: z.string(),
  })
);

// Used by Gemini to create the description & story
export const PostcardDescriptionStoryRequestSchema = ai.defineSchema(
  'PostcardDescriptionStoryRequest',
  z.object({
    start: z.string(),
    end: z.string(),
    mapImage: z.optional(z.string()),
    sender: z.string(),
    recipient: z.string(),
  })
);
export type PostcardDescriptionStoryRequest = z.infer<
  typeof PostcardDescriptionStoryRequestSchema
>;

// The output from this LLM step
export const PostcardDescriptionStoryResponseSchema = ai.defineSchema(
  'PostcardDescriptionStoryResponse',
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
  'PostcardImageRequest',
  z.object({
    start: z.string(),
    end: z.string(),
    story: z.string(),
  })
);
export type PostcardImageRequest = z.infer<typeof PostcardImageRequestSchema>;

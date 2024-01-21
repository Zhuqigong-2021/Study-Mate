import { z } from "zod";

export const ChoiceSchema = z.object({
  id: z.number().optional(),
  content: z.string().min(1, { message: "choice is required" }),
  answer: z.boolean().default(false),
});

export const createQuestionSchema = z.object({
  questionTitle: z.string().min(1, { message: "question is required" }),
  choices: z.array(ChoiceSchema),
});

export const updateQuestionSchema = z.object({
  id: z.number().min(1, { message: "id is required" }),
  questionTitle: z.string().min(1, { message: "question is required" }),
  choices: z.array(ChoiceSchema),
});

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  questions: z.array(createQuestionSchema).optional(),
});

export type CreateNoteSchema = z.infer<typeof createNoteSchema>;

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;

export const deleteNoteSchema = z.object({
  id: z.number().min(1),
});

export const updateNoteSchema = z.object({
  id: z.number().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  questions: z.array(updateQuestionSchema).optional(),
});

export type UpdateNoteSchema = z.infer<typeof updateNoteSchema>;

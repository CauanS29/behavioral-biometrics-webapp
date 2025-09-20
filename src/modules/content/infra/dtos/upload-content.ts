import { z } from "zod";

export const uploadContentSchema = z.object({
  userID: z.string().min(1, "userID é obrigatório"),
  weapon: z.string().min(1, "weapon é obrigatório"),
  sprayData: z.string().min(1, "sprayData (CSV) é obrigatório"),
});

export type UploadContentDTO = z.infer<typeof uploadContentSchema>;


export interface UploadContentResponse {
    userID: string;
    weapon: string;
    sprayData: string[];
    createdAt: string;
    updatedAt: string;
    message: string;
}
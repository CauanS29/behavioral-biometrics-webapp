import { z } from "zod";

export const uploadContentSchema = z.object({
  userID: z.string().min(1, "userID é obrigatório"),
  sprayData: z.instanceof(File, { message: "sprayData (.dem file) é obrigatório" }),
});

export type UploadContentDTO = z.infer<typeof uploadContentSchema>;


export interface UploadContentResponse {
    userID: string;
    sprayData: string[];
    createdAt: string;
    updatedAt: string;
    message: string;
}
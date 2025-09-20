import api from "@/modules/shared/infra/services/api";

import { UploadContentDTO, UploadContentResponse } from "../../../dtos/upload-content";


export class UploadContent {
    async uploadContent(content: UploadContentDTO) {
        const response = await api.post<UploadContentResponse>('/sprays', {
            userID: content.userID,
            weapon: content.weapon,
            sprayData: content.sprayData,
        });
        return response.data;
    }
}
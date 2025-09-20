import { useQuery } from "@tanstack/react-query";
import { UploadContent } from "../data/usecases/upload-content";
import { UploadContentDTO, UploadContentResponse } from "../../dtos/upload-content";
import { RemoteError } from "@/modules/shared/infra/errors/remote-error";
import { useMutation } from "@tanstack/react-query";


const UseContent = () => {
   
    const { mutateAsync: uploadContent, isPending, error, data } = useMutation<
    UploadContentResponse,
    RemoteError,
    UploadContentDTO
  >({
    mutationFn: async (data: UploadContentDTO) => {
      const content = await new UploadContent().uploadContent(data);
      return content;
    },
  });

  const handleUploadContent = async (data: UploadContentDTO) => {
    await uploadContent(data);
  };

  return {
    handleUploadContent,
    isPending,
    error,
    data,
  };
};

export default UseContent;
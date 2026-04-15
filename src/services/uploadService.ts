import api from "@/lib/axios";

export type UploadedImage = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
};

export const uploadService = {
  uploadImage: async (file: File, folder?: string) => {
    const form = new FormData();
    form.append("image", file);
    if (folder) form.append("folder", folder);

    // Do NOT set Content-Type manually; browser must set multipart boundary.
    const response = await api.post("/uploads/image", form);
    return response.data.data as UploadedImage;
  },
};


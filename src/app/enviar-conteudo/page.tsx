import MakeUploadContentPage from "@/modules/content/infra/factories/pages/MakeUploadContentPage";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function UploadContentPage() {
    return <MakeUploadContentPage/>;
}
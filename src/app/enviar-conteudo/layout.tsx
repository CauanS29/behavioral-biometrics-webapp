import MakeUploadContentPageLayout from "@/modules/content/infra/factories/layouts/MakeUploadContentPageLayout";
import { ProtectedRoute } from "@/modules/user/infra/services/components/ProtectedRoute";

export default function UploadContentPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <MakeUploadContentPageLayout>{children}</MakeUploadContentPageLayout>
        </ProtectedRoute>
    );
}
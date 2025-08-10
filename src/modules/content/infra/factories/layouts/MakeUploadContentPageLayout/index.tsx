import LandingPageLayout from "@/modules/shared/infra/presentation/layouts/LandingPageLayout";
import { MakeUploadContentPageLayoutProps } from "./types";

const MakeUploadContentPageLayout = ({ children }: MakeUploadContentPageLayoutProps) => {
    return(
        <LandingPageLayout>{children}</LandingPageLayout>
    )
}

export default MakeUploadContentPageLayout;
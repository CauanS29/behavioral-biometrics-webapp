import LandingPageLayout from "../../../presentation/layouts/LandingPageLayout";
import { MakeLandingPageLayoutProps } from "./types";

const MakeLandingPageLayout = ({ children }: MakeLandingPageLayoutProps) => {
    return(
        <LandingPageLayout>{children}</LandingPageLayout>
    )
}

export default MakeLandingPageLayout;
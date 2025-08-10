import MakeLandingPageLayout from "@/modules/shared/infra/factories/layouts/MakeLandingPageLayout";
import MakeLoginPage from "@/modules/user/infra/factories/pages/MakeLoginPage";
export default function Home() {
 return(
  <MakeLandingPageLayout>
    <MakeLoginPage/>
  </MakeLandingPageLayout>
 );
}

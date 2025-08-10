import { LandingPageLayoutProps } from "./types";
import Header from "../../components/Header";


const LandingPageLayout = ({ children }: LandingPageLayoutProps) => {
  return (
    <Header>
      {children}
    </Header>
  );
};

export default LandingPageLayout;

import { LandingPageComponent } from "@/components/landing-page";
import MiniChatbot from "@/components/MiniChatbot";
import Layout from "./layout";

export default function Home() {
  return (
    <Layout>
      <LandingPageComponent />
      <MiniChatbot />
    </Layout>
  );
}

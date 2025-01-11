import { Header } from "./site/header";
import { Footer } from "./site/footer";

export function SiteLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer className="sticky top-[100vh]" />
    </>
  );
}

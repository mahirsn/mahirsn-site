import { getPublicLinks } from "@/app/actions/links";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { LinkHub } from "@/components/link-hub";
import { Footer } from "@/components/footer";

export default async function Home() {
  const links = await getPublicLinks();

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-950">
        <Navbar />
        <Hero />
        <LinkHub
          links={links.map((link) => ({
            id: link.id,
            title: link.title,
            url: link.url,
            description: link.description ?? undefined,
            iconPath: link.iconPath ?? undefined,
            copy: link.isCopyable,
          }))}
        />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

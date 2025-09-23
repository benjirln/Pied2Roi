import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <Navigation />
      <article className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {updatedAt && (
          <p className="text-sm text-muted-foreground mb-10">
            Dernière mise à jour : {updatedAt}
          </p>
        )}
        <div className="space-y-8 leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-8 [&_strong]:text-foreground [&_a]:text-accent [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
          {children}
        </div>
      </article>
      <Footer />
    </main>
  );
}

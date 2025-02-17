import { Header } from "@/components/header";
import { Features } from "@/components/features";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="relative">
        {/* Gradient spotlight effect */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(64,94,255,0.4) 0%, rgba(64,94,255,0.1) 50%, transparent 70%)",
          }}
        />

        <div className="relative container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-medium text-white mb-6 tracking-tight">
              Achieve sustainability compliance in minutes, not months
            </h1>

            <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto">
              Simplify ESG reporting and compliance with AI-powered automation
              designed for today&apos;s businesses.
            </p>

            <Link href="https://cal.com/gyoung/30min" target="_blank">
              <Button size="lg" variant="secondary">
                Request a Demo
              </Button>
            </Link>
          </div>
        </div>

        <Features />
      </main>
    </div>
  );
}

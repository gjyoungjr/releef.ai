import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// TODO: Split into components
export default function Page() {
  return (
    <div className="overflow-y-hidden">
      <header className="fixed left-0 right-0 top-0 z-10 flex h-14 items-center p-4">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/dashboard"
            className="group flex w-full items-center gap-x-2.5"
          >
            <div className="flex aspect-square size-7 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
              <span className="text-lg">🍃</span>
            </div>
            <h3 className="font-semibold tracking-wide">Releef</h3>
          </Link>
        </nav>
        <div className="ml-auto">
          <Button>
            Join waitlist
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className={"grain-blur background-base"} />
      <div className={"grain-background background-base"} />
      <div className={"grid-bg background-base"} />
      <div className={"large-blur background-base"} />
      <div className={"small-blur background-base"} />

      <section
        className={
          "mx-auto max-w-7xl px-[32px] relative flex items-center justify-center h-screen overflow-hidden"
        }
      >
        <div className={"text-center w-full "}>
          <h1
            className={
              "text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-bold  "
            }
          >
            AI Gap Analysis
            <br />
            for sustainability reports.
          </h1>
          <p
            className={
              "mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px]"
            }
          >
            Identify compliance gaps, streamline reporting, and drive
            sustainability goals with the power of AI
          </p>
        </div>
      </section>

      <footer className="fixed left-0 right-0 bottom-0 z-10 flex h-14 items-center p-4">
        <p className="">Copyright</p>
      </footer>
    </div>
  );
}

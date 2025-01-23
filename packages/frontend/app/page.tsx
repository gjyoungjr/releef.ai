import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const FEATURES = [
  {
    title: "Gap Analysis",
    description:
      "Uncover compliance gaps in your sustainability reports and ensure alignment with industry standards and regulations.",
  },
  {
    title: "Recommendations",
    description:
      "Receive tailored recommendations to address compliance gaps and enhance sustainability performance.",
  },
  {
    title: "KPI Tracking",
    description:
      "Monitor and analyze key sustainability metrics to track your progress toward compliance and impact goals.",
  },
];

export default function Page() {
  return (
    <>
      <div className={"grain-blur background-base dark"} />
      <div className={"grain-background background-base"} />
      <div className={"grid-bg background-base"} />
      <div className={"large-blur background-base"} />
      <div className={"small-blur background-base"} />
      <header className="fixed left-0 right-0 top-0 z-10 flex h-14 items-center p-4">
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link href="/" className="group flex w-full items-center gap-x-2.5">
            <div className="flex aspect-square size-7 items-center justify-center rounded-lg border text-sidebar-primary-foreground">
              <span className="text-lg">🍃</span>
            </div>
            <h3 className="font-semibold tracking-wide">Releef</h3>
          </Link>
        </nav>
        <div className="ml-auto">
          <Link href="https://cal.com/gyoung/30min" target="_blank">
            <Button>Request a Demo</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-[32px] relative flex pt-52 justify-center">
        <div className={"text-center w-full "}>
          <h1 className="text-[45px] leading-[48px] md:text-[65px] md:leading-[65px] tracking-[-1.8px] font-bold  ">
            Achieve sustainability compliance
            <br />
            in minutes, not months.
          </h1>
          <p className="mt-6 text-[18px] leading-[27px] md:text-[20px] md:leading-[30px]">
            Identify compliance gaps, streamline reporting, and drive
            sustainability goals with the power of AI.
          </p>
        </div>
      </section>

      <div className="isolate mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 p-10">
        {FEATURES.map((feature, index) => (
          <div
            className={cn(
              "rounded-lg bg-inherit backdrop-blur-[6px] overflow-hidden"
            )}
            key={index}
          >
            <div
              className={cn(
                "flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border p-5"
              )}
            >
              <p className="font-semibold">{feature.title}</p>
              <p>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

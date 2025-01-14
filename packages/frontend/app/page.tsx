// TODO: Split into components
export default function Page() {
  return (
    <div>
      <div className={"grain-blur background-base"} />
      <div className={"grain-background background-base"} />
      <div className={"grid-bg background-base"} />
      <div className={"large-blur background-base"} />
      <div className={"small-blur background-base"} />

      <section
        className={
          "mx-auto max-w-7xl px-[32px] relative flex items-center justify-center h-screen"
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
    </div>
  );
}

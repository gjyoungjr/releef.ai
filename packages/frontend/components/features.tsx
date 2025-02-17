export function Features() {
  return (
    <div className="relative">
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-colors group"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">
                {feature.emoji}
              </div>
              <h3 className="text-white text-xl font-medium mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    emoji: "🌱",
    title: "Regulatory Gap Analysis",
    description:
      "Uncover compliance gaps in your sustainability disclosures and receive actionable recommendations to align with evolving regulations.",
  },
  {
    emoji: "💬",
    title: "AI Sustainability Analyst",
    description:
      "Interact with an intelligent chatbot that interprets disclosures, explains compliance requirements, and provides expert insights.",
  },
  {
    emoji: "📈",
    title: "KPI Extraction & Reporting",
    description:
      "Automatically extract key sustainability metrics from reports and convert them into structured, actionable data.",
  },
];

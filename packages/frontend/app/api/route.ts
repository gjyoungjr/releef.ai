import { NextApiRequest, NextApiResponse } from "next";

// Default chat model handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { message } = req.body;

    // Simple response logic
    let responseMessage = "I'm not sure how to respond to that.";

    if (message.toLowerCase().includes("hello")) {
      responseMessage = "Hello! How can I assist you today?";
    } else if (message.toLowerCase().includes("bye")) {
      responseMessage = "Goodbye! Have a great day!";
    }

    res.status(200).json({ response: responseMessage });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

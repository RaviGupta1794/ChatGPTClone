import "dotenv/config";

const getGeminiResponse = async (message) => {
  if (!message || !message.trim()) {
    throw new Error("Message is required");
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    // Check API key
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini status:", response.status);
    console.log("Gemini response:", data);

    // Gemini returned an error
    if (!response.ok) {
      throw new Error(
        data?.error?.message ||
          `Gemini API request failed with status ${response.status}`
      );
    }

    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.log("Unexpected Gemini response:", data);
      throw new Error("Gemini did not return any text");
    }

    return generatedText;

  } catch (error) {
    console.error("Gemini error:", error);

    // IMPORTANT:
    // Don't hide the original error
    throw error;
  }
};

export default getGeminiResponse;
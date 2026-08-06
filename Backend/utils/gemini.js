import "dotenv/config";

const getGeminiResponse = async (message) => {
  if (!message) {
    throw new Error("messages is required");
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API Error");
    }

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated."
    );
  } catch (error) {
    console.error(error);
    throw new Error("Gemini API Error");
  }
};

export default getGeminiResponse;

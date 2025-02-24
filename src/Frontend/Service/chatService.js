import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const generateResponse = async (userMessage, conversationHistory) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Bạn là trợ lý ảo chuyên hỗ trợ khách hàng thuê phòng trọ. Trả lời ngắn gọn, chuyên nghiệp và thân thiện.",
        },
        ...conversationHistory,
        { role: "user", content: userMessage },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Connection Error:", error);
    return "Xin lỗi, dịch vụ hỗ trợ đang gặp sự cố. Vui lòng thử lại sau.";
  }
};

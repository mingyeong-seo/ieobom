/* global process */

const fallbackStory = {
  summary:
    "오늘은 병원에 다녀오시고, 점심도 잘 챙겨 드셨어요. 오후에는 산책을 하며 사진도 남기셨고, 저녁 약도 잘 챙겨 드시며 하루를 마무리하셨어요.",
  keywords: ["병원", "식사", "산책", "약 복용"],
  ai_suggestion: "오늘 기록을 바탕으로 가족에게 따뜻한 안부를 전해보세요.",
};

function normalizeBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body;
}

function extractOutputText(data) {
  if (data.output_text) {
    return data.output_text;
  }

  const textParts =
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter(Boolean) ?? [];

  return textParts.join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-5.1-mini";

  if (!apiKey) {
    return res.status(200).json({
      ...fallbackStory,
      source: "fallback",
    });
  }

  const body = normalizeBody(req.body);
  const messages = body.messages ?? [];
  const routines = body.routines ?? [];

  const prompt = `
이어봄은 고령 부모님의 하루를 감시가 아니라 가족에게 전하는 따뜻한 하루 이야기로 정리하는 서비스입니다.
아래 대화와 루틴을 바탕으로 보호자가 읽을 하루 요약을 한국어로 작성해 주세요.

규칙:
- 진단, 감지, 위험 같은 표현을 쓰지 마세요.
- 2~4문장으로 따뜻하고 담백하게 작성하세요.
- 마지막에 자연스러운 이모지 하나까지만 허용합니다.
- 출력은 summary, keywords, ai_suggestion 키를 가진 JSON만 반환하세요.

대화:
${JSON.stringify(messages, null, 2)}

루틴:
${JSON.stringify(routines, null, 2)}
`;

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "ieobom_story",
            schema: {
              type: "object",
              additionalProperties: false,
              required: ["summary", "keywords", "ai_suggestion"],
              properties: {
                summary: { type: "string" },
                keywords: {
                  type: "array",
                  items: { type: "string" },
                  minItems: 1,
                  maxItems: 5,
                },
                ai_suggestion: { type: "string" },
              },
            },
            strict: true,
          },
        },
      }),
    });

    if (!openaiResponse.ok) {
      return res.status(200).json({
        ...fallbackStory,
        source: "fallback",
      });
    }

    const data = await openaiResponse.json();
    const outputText = extractOutputText(data);
    const story = JSON.parse(outputText);

    return res.status(200).json({
      ...story,
      source: "openai",
    });
  } catch {
    return res.status(200).json({
      ...fallbackStory,
      source: "fallback",
    });
  }
}

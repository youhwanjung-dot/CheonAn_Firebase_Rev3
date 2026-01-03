import { GoogleGenAI } from "@google/genai";
import { InventoryItem } from '../types';

export const analyzeInventory = async (data: string | InventoryItem[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API 키가 설정되지 않았습니다. AI 분석을 사용할 수 없습니다.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Check if input is raw items (legacy) or summary context (new visual report)
    let contextData = "";
    let systemInstruction = "";

    if (typeof data === 'string') {
        // Visual Report Mode: Receive summarized JSON string
        contextData = data;
        systemInstruction = `
            당신은 '천안수질정화센터'의 자재 관리 전문가입니다.
            사용자는 이미 데이터 시각화 리포트를 통해 구체적인 수치(부족 수량, 과다 재고 등)를 확인했습니다.
            당신의 역할은 나열된 수치를 단순 반복하는 것이 아니라, **경영학적/물류학적 관점에서의 '해석'과 '전략'을 제시**하는 것입니다.

            입력으로 제공된 요약 데이터(JSON)를 바탕으로 아래 3가지 항목에 대해 3~4줄 내외로 간결하게 조언해주세요.
            
            1. **재고 건전성 평가**: 현재 부족/과다 비율을 보고 전반적인 상태가 양호한지 위험한지 진단.
            2. **우선 조치 사항**: 긴급 발주가 필요한 품목이나 공간 확보가 필요한 부분에 대한 구체적 행동 지침.
            3. **효율화 제안**: 장기 미사용 품목 처리 방안 또는 발주 주기 최적화 제안.

            **주의사항**:
            - Markdown 형식을 사용하여 가독성을 높이세요 (볼드체 등).
            - 이미 표에 있는 숫자를 단순히 다시 나열하지 마세요. (예: "A가 5개 부족합니다" -> X, "A품목의 부족분이 심각하므로 즉시 발주가 필요합니다" -> O)
            - 단가(금액)에 대한 언급은 하지 마세요. (데이터 없음)
        `;
    } else {
        // Legacy Mode: Receive full item list (Keep purely for backward compatibility if needed, though mostly replaced)
         contextData = JSON.stringify(data.map(i => ({
            name: i.name,
            category: i.category,
            currentStock: i.currentStock,
            safeStock: i.safeStock
          })), null, 2);
          systemInstruction = "기존 텍스트 리포트 생성 로직입니다. (사용 빈도 낮음)";
    }

    const prompt = `
      ${systemInstruction}

      ## 분석 대상 요약 데이터:
      ${contextData}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const text = response.text;
    return text || "AI 분석 결과를 생성하는 데 실패했습니다.";

  } catch (error) {
    console.error("Error analyzing inventory:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       return "## 분석 오류\n\n**API 키가 유효하지 않습니다.** AI Studio에서 올바른 API 키를 설정했는지 확인해주세요.";
    }
    return "## 분석 오류\n\nAI 분석 중 예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
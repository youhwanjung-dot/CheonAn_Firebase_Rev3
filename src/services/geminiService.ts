/*
import { GoogleGenerativeAI } from "@google/genai";
import { InventoryItem } from '../types';

// Vite 환경 변수에서 API 키를 가져옵니다.
const apiKey = import.meta.env.VITE_API_KEY;

export const analyzeInventory = async (data: string | InventoryItem[]): Promise<string> => {
  // API 키가 없는 경우 사용자에게 알리고 함수를 종료합니다.
  if (!apiKey) {
    return "API 키가 설정되지 않았습니다. AI 분석을 사용할 수 없습니다.";
  }
  
  try {
    // GoogleGenerativeAI 인스턴스를 생성합니다.
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

    let contextData = "";
    let systemInstruction = "";

    // 입력 데이터의 유형에 따라 컨텍스트와 시스템 지침을 설정합니다.
    if (typeof data === 'string') {
        contextData = data;
        systemInstruction = `
            당신은 '천안수질정화센터'의 자재 관리 전문가입니다.
            제공된 요약 데이터(JSON)를 바탕으로 아래 3가지 항목에 대해 간결하게 조언해주세요.
            
            1. **재고 건전성 평가**: 현재 부족/과다 비율 진단.
            2. **우선 조치 사항**: 긴급 발주 품목에 대한 행동 지침.
            3. **효율화 제안**: 발주 주기 최적화 제안.
        `;
    } else {
         contextData = JSON.stringify(data.map(i => ({
            name: i.name,
            currentStock: i.currentStock,
            safeStock: i.safeStock
          })), null, 2);
          systemInstruction = "재고 분석 전문가로서 의견을 제시하십시오.";
    }

    // AI 모델에게 콘텐츠 생성을 요청합니다.
    const result = await model.generateContent([systemInstruction, contextData]);
    const response = result.response;
    
    // 생성된 텍스트를 반환하거나, 실패 시 메시지를 반환합니다.
    return response.text() || "AI 분석 결과를 생성하는 데 실패했습니다.";

  } catch (error) {
    // 오류 발생 시 콘솔에 로그를 남기고 사용자에게 오류 메시지를 반환합니다.
    console.error("Error analyzing inventory:", error);
    return "## 분석 오류\n\nAI 분석 중 오류가 발생했습니다. API 설정 혹은 네트워크 상태를 확인해 주세요.";
  }
};
*/
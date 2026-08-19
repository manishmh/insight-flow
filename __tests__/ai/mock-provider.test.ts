import { generateAiText } from "../../src/server/ai/providers";

// Mock the db dependency
jest.mock("../../src/lib/db", () => ({
  db: {
    aIProviderConfig: {
      findUnique: jest.fn().mockResolvedValue({
        provider: 'mock',
        model: 'mock-model',
        privacyMode: 'MINIMIZED'
      })
    }
  }
}));

describe("Mock Provider Adapter", () => {
  it("should return a deterministic mock response", async () => {
    const result = await generateAiText("user-1", "Hello");
    expect(result.text).toBe("This is a deterministic mock response.");
    expect(result.usage?.totalTokens).toBe(10);
  });
});

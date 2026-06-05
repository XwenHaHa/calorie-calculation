let context: any = null;
let currentModelPath: string | null = null;
let isNativeAvailable: boolean | null = null;

async function getLlamaModule() {
  if (isNativeAvailable === false) return null;
  try {
    const mod = await import('llama-cpp-capacitor');
    isNativeAvailable = true;
    return mod;
  } catch {
    isNativeAvailable = false;
    return null;
  }
}

export async function initLocalModel(modelPath: string): Promise<void> {
  if (context && currentModelPath === modelPath) return;

  const llama = await getLlamaModule();
  if (!llama) throw new Error('本地模型仅在 App 端可用');

  if (context) {
    await releaseModel();
  }

  context = await llama.initLlama({
    model: modelPath,
    n_ctx: 2048,
    n_threads: 4,
    n_gpu_layers: 0,
  });
  currentModelPath = modelPath;
}

export async function generateText(prompt: string, systemPrompt: string): Promise<string> {
  if (!context) {
    throw new Error('本地模型未初始化');
  }

  const result = await context.completion({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    n_predict: 512,
    temperature: 0.7,
    top_p: 0.9,
    stop: ['</s>'],
  });

  return result.text.trim();
}

export async function releaseModel(): Promise<void> {
  if (context) {
    try {
      const llama = await getLlamaModule();
      if (llama) await llama.releaseAllLlama();
    } catch { /* ignore */ }
    context = null;
    currentModelPath = null;
  }
}

export function isModelReady(): boolean {
  return context !== null;
}

export function getCurrentModelPath(): string | null {
  return currentModelPath;
}

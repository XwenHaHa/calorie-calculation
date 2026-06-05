import type { AIResult, ModelPreference } from '../types';
import { getModelPreference } from './storage';
import { isModelReady } from './local-llm';

export async function callAI<T>(params: {
  onlineFn: () => Promise<T>;
  localFn: () => Promise<T>;
  fallbackFn: () => T;
  preference?: ModelPreference;
}): Promise<AIResult<T>> {
  const pref = params.preference ?? getModelPreference();

  if (pref === 'local') {
    try {
      const data = await params.localFn();
      return { data, source: 'local' };
    } catch {
      return { data: params.fallbackFn(), source: 'local' };
    }
  }

  if (pref === 'online') {
    try {
      const data = await params.onlineFn();
      return { data, source: 'online' };
    } catch {
      return { data: params.fallbackFn(), source: 'online', onlineFailed: true };
    }
  }

  // auto mode
  try {
    const data = await params.onlineFn();
    return { data, source: 'online' };
  } catch {
    if (isModelReady()) {
      try {
        const data = await params.localFn();
        return { data, source: 'local', onlineFailed: true };
      } catch {
        return { data: params.fallbackFn(), source: 'local', onlineFailed: true };
      }
    }
    return { data: params.fallbackFn(), source: 'online', onlineFailed: true };
  }
}

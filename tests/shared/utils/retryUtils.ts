export async function retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 10,
    retryDelay: number = 5000
  ): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
    throw new Error(`Function failed after ${maxRetries} attempts`);
  }
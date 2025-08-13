// Simple utility function tests to demonstrate testing infrastructure
describe('Basic Testing Infrastructure', () => {
  it('should have Jest working correctly', () => {
    expect(true).toBe(true);
  });

  it('should support TypeScript compilation', () => {
    const testObject: { name: string; count: number } = {
      name: 'test',
      count: 42,
    };

    expect(testObject.name).toBe('test');
    expect(testObject.count).toBe(42);
  });

  it('should support async/await', async () => {
    const asyncFunction = async (): Promise<string> => {
      return Promise.resolve('async test');
    };

    const result = await asyncFunction();
    expect(result).toBe('async test');
  });

  it('should support environment variables', () => {
    expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();
  });

  it('should support mocking', () => {
    const mockFunction = jest.fn();
    mockFunction.mockReturnValue('mocked');

    const result = mockFunction();
    expect(result).toBe('mocked');
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});

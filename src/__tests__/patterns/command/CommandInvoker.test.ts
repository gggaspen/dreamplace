import { CommandInvoker } from '@/patterns/command/CommandInvoker';
import { BaseCommand } from '@/patterns/command/BaseCommand';
import { CommandType } from '@/patterns/command/types';

// Mock command for testing
class MockCommand extends BaseCommand<string> {
  private executed = false;
  private undone = false;

  constructor(
    private value: string,
    private shouldFail = false
  ) {
    super(CommandType.FETCH_DATA, { value });
  }

  async execute(): Promise<string> {
    if (this.shouldFail) {
      throw new Error('Command execution failed');
    }
    this.executed = true;
    return this.value;
  }

  canUndo(): boolean {
    return this.executed && !this.undone;
  }

  protected async performUndo(): Promise<void> {
    this.undone = true;
    this.executed = false;
  }

  getDescription(): string {
    return `Mock command with value: ${this.value}`;
  }

  isExecuted(): boolean {
    return this.executed;
  }

  isUndone(): boolean {
    return this.undone;
  }
}

describe('CommandInvoker', () => {
  let invoker: CommandInvoker;

  beforeEach(() => {
    invoker = new CommandInvoker();
  });

  describe('execute', () => {
    it('should execute a command successfully', async () => {
      const command = new MockCommand('test');
      const result = await invoker.execute(command);

      expect(result.success).toBe(true);
      expect(result.data).toBe('test');
      expect(result.error).toBeUndefined();
      expect(command.isExecuted()).toBe(true);
    });

    it('should handle command execution failures', async () => {
      const command = new MockCommand('test', true);
      const result = await invoker.execute(command);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Command execution failed');
    });

    it('should add executed commands to history', async () => {
      const command1 = new MockCommand('test1');
      const command2 = new MockCommand('test2');

      await invoker.execute(command1);
      await invoker.execute(command2);

      const history = invoker.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].payload).toEqual({ value: 'test1' });
      expect(history[1].payload).toEqual({ value: 'test2' });
    });
  });

  describe('undo/redo', () => {
    it('should undo the last executed command', async () => {
      const command = new MockCommand('test');
      await invoker.execute(command);

      expect(invoker.canUndo()).toBe(true);
      await invoker.undo();

      expect(command.isUndone()).toBe(true);
      expect(invoker.canUndo()).toBe(false);
    });

    it('should redo the last undone command', async () => {
      const command = new MockCommand('test');
      await invoker.execute(command);
      await invoker.undo();

      expect(invoker.canRedo()).toBe(true);
      await invoker.redo();

      expect(command.isExecuted()).toBe(true);
      expect(invoker.canRedo()).toBe(false);
    });

    it('should throw error when trying to undo with no commands', async () => {
      expect(invoker.canUndo()).toBe(false);
      await expect(invoker.undo()).rejects.toThrow('No commands to undo');
    });

    it('should throw error when trying to redo with no commands', async () => {
      expect(invoker.canRedo()).toBe(false);
      await expect(invoker.redo()).rejects.toThrow('No commands to redo');
    });
  });

  describe('history management', () => {
    it('should maintain history size limit', async () => {
      const smallInvoker = new CommandInvoker(2);

      await smallInvoker.execute(new MockCommand('test1'));
      await smallInvoker.execute(new MockCommand('test2'));
      await smallInvoker.execute(new MockCommand('test3'));

      const history = smallInvoker.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].payload).toEqual({ value: 'test2' });
      expect(history[1].payload).toEqual({ value: 'test3' });
    });

    it('should clear history when requested', async () => {
      await invoker.execute(new MockCommand('test1'));
      await invoker.execute(new MockCommand('test2'));

      expect(invoker.getHistory()).toHaveLength(2);

      invoker.clearHistory();

      expect(invoker.getHistory()).toHaveLength(0);
      expect(invoker.canUndo()).toBe(false);
      expect(invoker.canRedo()).toBe(false);
    });

    it('should truncate future history when new command is executed after undo', async () => {
      await invoker.execute(new MockCommand('test1'));
      await invoker.execute(new MockCommand('test2'));
      await invoker.execute(new MockCommand('test3'));

      // Undo twice
      await invoker.undo();
      await invoker.undo();

      // Execute new command
      await invoker.execute(new MockCommand('test4'));

      const history = invoker.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].payload).toEqual({ value: 'test1' });
      expect(history[1].payload).toEqual({ value: 'test4' });
    });
  });

  describe('getters', () => {
    it('should return correct history size and current index', async () => {
      expect(invoker.getHistorySize()).toBe(0);
      expect(invoker.getCurrentIndex()).toBe(-1);

      await invoker.execute(new MockCommand('test1'));
      expect(invoker.getHistorySize()).toBe(1);
      expect(invoker.getCurrentIndex()).toBe(0);

      await invoker.execute(new MockCommand('test2'));
      expect(invoker.getHistorySize()).toBe(2);
      expect(invoker.getCurrentIndex()).toBe(1);

      await invoker.undo();
      expect(invoker.getCurrentIndex()).toBe(0);
    });
  });
});

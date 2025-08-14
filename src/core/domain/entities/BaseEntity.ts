export abstract class BaseEntity {
  public readonly id: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: number, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public equals(other: BaseEntity): boolean {
    return this.id === other.id;
  }

  public isNew(): boolean {
    return this.id === 0;
  }
}

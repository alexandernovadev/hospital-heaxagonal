import { v4 as uuidv4 } from "uuid";

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;

  protected constructor(eventId?: string, occurredOn?: Date) {
    this.eventId = eventId ?? uuidv4();
    this.occurredOn = occurredOn ?? new Date();
  }
}

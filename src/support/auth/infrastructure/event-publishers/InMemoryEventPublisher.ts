import { IEventPublisher } from "../../application/ports/IEventPublisher";
import { DomainEvent } from "../../../../shared/domain/DomainEvent";

export class InMemoryEventPublisher implements IEventPublisher {
  async publish(event: DomainEvent): Promise<void> {
    console.log(`Publishing event: ${event.constructor.name}`);
  }
}

import { DomainEvent } from "../../../../shared/domain/DomainEvent";

export interface IEventPublisher {
  publish(event: DomainEvent): Promise<void>;
}

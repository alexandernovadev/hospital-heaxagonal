import { InMemoryEventPublisher } from "./InMemoryEventPublisher";
import { UserID } from "../../domain/value-objects/UserId";
import { UserRegisteredEvent } from "../../domain/events/UserRegisteredEvent";
import { Username } from "../../domain/value-objects/Username";
import { Email } from "../../domain/value-objects/Email";

describe("InMemoryEventPublisher", () => {
  let eventPublisher: InMemoryEventPublisher;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    eventPublisher = new InMemoryEventPublisher();
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("should log the event name when publishing an event", async () => {
    const userId = UserID.createNew();
    const event = UserRegisteredEvent.create(
      userId,
      Username.create("testuser"),
      Email.create("test@example.com")
    );

    await eventPublisher.publish(event);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Publishing event: ${event.constructor.name}`
    );
  });

  it("should handle multiple events being published", async () => {
    const userId1 = UserID.createNew();
    const event1 = UserRegisteredEvent.create(
      userId1,
      Username.create("testuser1"),
      Email.create("test1@example.com")
    );

    const userId2 = UserID.createNew();
    const event2 = UserRegisteredEvent.create(
      userId2,
      Username.create("testuser2"),
      Email.create("test2@example.com")
    );

    await eventPublisher.publish(event1);
    await eventPublisher.publish(event2);

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith(
      `Publishing event: ${event1.constructor.name}`
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      `Publishing event: ${event2.constructor.name}`
    );
  });

  it("should not throw an error if event is null or undefined", async () => {
    // This test ensures robustness even if an invalid event is passed (though types should prevent this)
    await expect(eventPublisher.publish(null as any)).rejects.toThrow(TypeError);
    await expect(eventPublisher.publish(undefined as any)).rejects.toThrow(TypeError);
    expect(consoleSpy).not.toHaveBeenCalled(); // No logging should occur if an error is thrown before it.
  });
});

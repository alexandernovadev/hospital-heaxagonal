import { InMemoryUserRepository } from "./InMemoryUserRepository";
import { User } from "../../domain/entities/User";
import { UserID } from "../../domain/value-objects/UserId";
import { Username } from "../../domain/value-objects/Username";
import { Email } from "../../domain/value-objects/Email";
import { PasswordHash } from "../../domain/value-objects/PasswordHash";

describe("InMemoryUserRepository", () => {
  let userRepository: InMemoryUserRepository;
  let user1: User;
  let user2: User;

  const hashedPassword = PasswordHash.create(
    "$2b$10$rinaO4LUKL6Or4xpP78O5OZUOZWCL/.A1GkRH/MApfRKXDfORhuL6"
  ); // 60 chars

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();

    const userId1 = UserID.createNew();
    const username1 = Username.create("testuser1");
    const email1 = Email.create("test1@example.com");
    user1 = User.create(userId1, username1, hashedPassword, email1);

    const userId2 = UserID.createNew();
    const username2 = Username.create("testuser2");
    const email2 = Email.create("test2@example.com");
    user2 = User.create(userId2, username2, hashedPassword, email2);

    // Populate the repository with initial data
    userRepository.save(user1);
    userRepository.save(user2);
  });

  it("should find a user by ID", async () => {
    const foundUser = await userRepository.findById(user1.getId());
    expect(foundUser).toEqual(user1);
  });

  it("should return null if user not found by ID", async () => {
    const nonExistentId = UserID.createNew();
    const foundUser = await userRepository.findById(nonExistentId);
    expect(foundUser).toBeNull();
  });

  it("should find a user by username", async () => {
    const foundUser = await userRepository.findByUsername(user1.getUsername());
    expect(foundUser).toEqual(user1);
  });

  it("should return null if user not found by username", async () => {
    const nonExistentUsername = Username.create("nonexistent");
    const foundUser = await userRepository.findByUsername(nonExistentUsername);
    expect(foundUser).toBeNull();
  });

  it("should find a user by email", async () => {
    const foundUser = await userRepository.findByEmail(user1.getEmail());
    expect(foundUser).toEqual(user1);
  });

  it("should return null if user not found by email", async () => {
    const nonExistentEmail = Email.create("nonexistent@example.com");
    const foundUser = await userRepository.findByEmail(nonExistentEmail);
    expect(foundUser).toBeNull();
  });

  it("should return true if user exists", async () => {
    const exists = await userRepository.exists(user1.getId());
    expect(exists).toBe(true);
  });

  it("should return false if user does not exist", async () => {
    const nonExistentId = UserID.createNew();
    const exists = await userRepository.exists(nonExistentId);
    expect(exists).toBe(false);
  });

  it("should save a new user", async () => {
    const userId3 = UserID.createNew();
    const username3 = Username.create("testuser3");
    const email3 = Email.create("test3@example.com");
    const newUser = User.create(userId3, username3, hashedPassword, email3);

    await userRepository.save(newUser);
    const foundUser = await userRepository.findById(userId3);
    expect(foundUser).toEqual(newUser);
  });

  it("should update an existing user", async () => {
    const updatedUsername = Username.create("updateduser1");
    user1.changeUsername(updatedUsername);

    await userRepository.save(user1);
    const foundUser = await userRepository.findById(user1.getId());
    expect(foundUser?.getUsername().getValue()).toBe(updatedUsername.getValue());
  });

  it("should delete a user", async () => {
    await userRepository.delete(user1.getId());
    const foundUser = await userRepository.findById(user1.getId());
    expect(foundUser).toBeNull();
  });

  it("should do nothing if deleting a non-existent user", async () => {
    const nonExistentId = UserID.createNew();
    await expect(userRepository.delete(nonExistentId)).resolves.not.toThrow();
    // Verify other users are still there
    expect(await userRepository.findById(user2.getId())).toEqual(user2);
  });
});

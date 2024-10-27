import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("User Model Tests", () => {
  let userId = null;

  beforeAll(() => {
    spyOn(prisma.user, "create").and.callFake(async data => {
      return {
        id: 1,
        username: data.data.username,
        email: data.data.email,
        password: data.data.password,
        status: data.data.status,
      };
    });

    spyOn(prisma.user, "update").and.callFake(async data => {
      if (data.where.id === 1) {
        return {
          id: 1,
          username: data.data.username,
          email: data.data.email,
          password: data.data.password,
          status: data.data.status,
        };
      } else {
        throw new Error("User not found");
      }
    });

    spyOn(prisma.user, "findMany").and.callFake(async () => {
      return [
        {
          id: 1,
          username: "johndoe",
          email: "johndoe@example.com",
          password: "1234",
          status: true,
        },
      ];
    });
    spyOn(prisma.user, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("User not found");
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const user = {
      username: "johndoe",
      email: "johndoe@example.com",
      password: "1234",
      status: true,
    };

    const result = await prisma.user.create({
      data: user,
    });

    userId = result.id;
    expect(result).not.toBeNull();
    expect(result.username).toBe(user.username);
    expect(result.email).toBe(user.email);
    expect(result.password).toBe(user.password);
    expect(result.status).toBe(user.status);
  });

  it("can be updated", async () => {
    const updatedUser = {
      username: "john_updated",
      email: "john_updated@example.com",
      password: "updated_password",
      status: false,
    };

    const result = await prisma.user.update({
      where: { id: userId },
      data: updatedUser,
    });

    expect(result.username).toBe(updatedUser.username);
    expect(result.email).toBe(updatedUser.email);
    expect(result.password).toBe(updatedUser.password);
    expect(result.status).toBe(updatedUser.status);
  });

  it("fails to update a user that does not exist", async () => {
    const invalidId = 999999;
    const updatedUser = {
      username: "nonexistent_user",
      email: "nonexistent@example.com",
      password: "password",
      status: false,
    };

    try {
      await prisma.user.update({
        where: { id: invalidId },
        data: updatedUser,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("can get all users", async () => {
    const allUsers = await prisma.user.findMany();

    expect(allUsers).not.toBeNull();
    expect(allUsers.length).toBeGreaterThan(0);
  });

  it("can be deleted", async () => {
    const result = await prisma.user.delete({
      where: { id: userId },
    });

    expect(result.id).toEqual(userId);
  });

  it("fails to delete a user that does not exist", async () => {
    const invalidId = 999999;

    try {
      await prisma.user.delete({
        where: { id: invalidId },
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

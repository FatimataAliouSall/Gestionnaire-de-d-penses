import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

describe("PaymentMethod Model Tests", () => {
  let methodId = null;

  beforeAll(() => {
    spyOn(prisma.paymentMethod, "create").and.callFake(async data => {
      return {
        id: 1,
        name: data.data.name,
        status: data.data.status,
        userId: data.data.userId,
      };
    });

    spyOn(prisma.paymentMethod, "update").and.callFake(async data => {
      if (data.where.id === 1) {
        return {
          id: 1,
          name: data.data.name,
          status: data.data.status,
          userId: data.data.userId,
        };
      } else {
        throw new Error("PaymentMethod not found");
      }
    });

    spyOn(prisma.paymentMethod, "findMany").and.callFake(async () => {
      return [
        {
          id: 1,
          name: "Credit Card",
          status: true,
          userId: 1,
        },
      ];
    });

    spyOn(prisma.paymentMethod, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Prisma.PrismaClientKnownRequestError(
          "Record to delete does not exist.",
          "P2025", 
          ""
        );
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const method = { name: "Credit Card", status: true, userId: 1 };
    const result = await prisma.paymentMethod.create({ data: method });
    methodId = result.id;

    expect(result).not.toBeNull();
    expect(result.name).toBe(method.name);
    expect(result.status).toBe(method.status);
  });

  it("can be updated", async () => {
    const updatedMethod = { name: "Debit Card", status: false, userId: 1 };
    const result = await prisma.paymentMethod.update({ where: { id: methodId }, data: updatedMethod });

    expect(result.name).toBe(updatedMethod.name);
    expect(result.status).toBe(updatedMethod.status);
  });

  it("fails to update a non-existent payment method", async () => {
    const invalidId = 999999;
    try {
      await prisma.paymentMethod.update({ where: { id: invalidId }, data: { name: "Invalid" } });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("can get all payment methods", async () => {
    const methods = await prisma.paymentMethod.findMany();
    expect(methods).not.toBeNull();
    expect(methods.length).toBeGreaterThan(0);
  });

  it("can be deleted", async () => {
    const result = await prisma.paymentMethod.delete({ where: { id: methodId } });
    expect(result.id).toEqual(methodId);
  });

  it("fails to delete a payment method that does not exist", async () => {
    const invalidId = 999999;

    await expectAsync(
      prisma.paymentMethod.delete({ where: { id: invalidId } })
    ).toBeRejectedWithError(Prisma.PrismaClientKnownRequestError, /Record to delete does not exist/);
  });
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Payment Model Tests", () => {
  let paymentId = null;

  beforeAll(() => {
    spyOn(prisma.payment, "create").and.callFake(async data => {
      return { id: 1, amount: data.data.amount, paymentDate: data.data.paymentDate, reference: data.data.reference, userId: data.data.userId, planningId: data.data.planningId, paymentMethodId: data.data.paymentMethodId, expenseId: data.data.expenseId };
    });

    spyOn(prisma.payment, "update").and.callFake(async data => {
      if (data.where.id === 1) {
        return { ...data.data, id: 1 };
      } else {
        throw new Error("Payment not found");
      }
    });

    spyOn(prisma.payment, "findMany").and.callFake(async () => {
      return [{ id: 1, amount: 200.0, paymentDate: new Date(), reference: "TX1234", userId: 1, planningId: 1, paymentMethodId: 1, expenseId: 1 }];
    });

    spyOn(prisma.payment, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("Payment not found");
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const payment = { amount: 200.0, paymentDate: new Date(), reference: "TX1234", userId: 1, planningId: 1, paymentMethodId: 1, expenseId: 1 };
    const result = await prisma.payment.create({ data: payment });
    paymentId = result.id;

    expect(result).not.toBeNull();
    expect(result.reference).toBe(payment.reference);
  });

  it("can be updated", async () => {
    const updatedPayment = { amount: 250.0, reference: "TX5678" };
    const result = await prisma.payment.update({ where: { id: paymentId }, data: updatedPayment });

    expect(result.amount).toBe(updatedPayment.amount);
    expect(result.reference).toBe(updatedPayment.reference);
  });

  it("fails to update a payment that does not exist", async () => {
    const updatedPayment = { amount: 300.0, reference: "TX9999" };
    
    await expectAsync(prisma.payment.update({ where: { id: 9999 }, data: updatedPayment }))
      .toBeRejectedWithError("Payment not found");
  });

  it("can get all payments", async () => {
    const result = await prisma.payment.findMany();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].reference).toBe("TX1234");
  });

  it("can be deleted", async () => {
    const result = await prisma.payment.delete({ where: { id: paymentId } });
    expect(result.id).toBe(paymentId);
  });

  it("fails to delete a payment that does not exist", async () => {
    await expectAsync(prisma.payment.delete({ where: { id: 9999 } }))
      .toBeRejectedWithError("Payment not found");
  });
});

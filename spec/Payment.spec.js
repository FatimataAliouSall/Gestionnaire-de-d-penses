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
  });
  
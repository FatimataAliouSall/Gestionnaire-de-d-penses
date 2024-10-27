import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Planning Model Tests", () => {
  let planningId = null;

  beforeAll(() => {
    spyOn(prisma.planning, "create").and.callFake(async data => {
      return { id: 1, name: data.data.name, startDate: data.data.startDate, endDate: data.data.endDate, amount: data.data.amount, expenseId: data.data.expenseId };
    });

    spyOn(prisma.planning, "update").and.callFake(async data => {
      if (data.where.id === 1) {
        return { ...data.data, id: 1 };
      } else {
        throw new Error("Planning not found");
      }
    });

    spyOn(prisma.planning, "findMany").and.callFake(async () => {
      return [{ id: 1, name: "Monthly Budget", startDate: new Date(), endDate: new Date(), amount: 500.0, expenseId: 1 }];
    });

    spyOn(prisma.planning, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("Planning not found");
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const planning = { name: "Monthly Budget", startDate: new Date(), endDate: new Date(), amount: 500.0, expenseId: 1 };
    const result = await prisma.planning.create({ data: planning });
    planningId = result.id;

    expect(result).not.toBeNull();
    expect(result.name).toBe(planning.name);
  });

  it("can be updated", async () => {
    const updatedPlanning = { name: "Annual Budget", amount: 6000.0 };
    const result = await prisma.planning.update({ where: { id: planningId }, data: updatedPlanning });

    expect(result.name).toBe(updatedPlanning.name);
    expect(result.amount).toBe(updatedPlanning.amount);
  });

  it("fails to update a planning that does not exist", async () => {
    const updatedPlanning = { name: "Non-existent Budget", amount: 7000.0 };
    
    await expectAsync(prisma.planning.update({ where: { id: 9999 }, data: updatedPlanning }))
      .toBeRejectedWithError("Planning not found");
  });

  it("can get all plannings", async () => {
    const result = await prisma.planning.findMany();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].name).toBe("Monthly Budget");
  });

  it("can be deleted", async () => {
    const result = await prisma.planning.delete({ where: { id: planningId } });
    expect(result.id).toBe(planningId);
  });

  it("fails to delete a planning that does not exist", async () => {
    await expectAsync(prisma.planning.delete({ where: { id: 9999 } }))
      .toBeRejectedWithError("Planning not found");
  });
});

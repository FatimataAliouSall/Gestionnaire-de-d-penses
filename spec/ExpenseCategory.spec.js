import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("ExpenseCategory Model Tests", () => {
  let categoryId = null;

  beforeAll(() => {
    spyOn(prisma.expenseCategory, "create").and.callFake(async data => {
      return {
        id: 1,
        name: data.data.name,
        status: data.data.status,
        userId: data.data.userId,
      };
    });
    spyOn(prisma.expenseCategory, "update").and.callFake(async data => {
      if (data.where.id === 1) {
        return {
          id: 1,
          name: data.data.name,
          status: data.data.status,
          userId: data.data.userId,
        };
      } else {
        throw new Error("ExpenseCategory not found");
      }
    });

    spyOn(prisma.expenseCategory, "findMany").and.callFake(async () => {
      return [
        {
          id: 1,
          name: "Office Supplies",
          status: true,
          userId: 1,
        },
      ];
    });

    spyOn(prisma.expenseCategory, "delete").and.callFake(async data => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error("ExpenseCategory not found");
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("can be created", async () => {
    const category = {
      name: "Office Supplies",
      status: true,
      userId: 1,
    };

    const result = await prisma.expenseCategory.create({
      data: category,
    });

    categoryId = result.id;
    expect(result).not.toBeNull();
    expect(result.name).toBe(category.name);
    expect(result.status).toBe(category.status);
    expect(result.userId).toBe(category.userId);
  });

  it("can be updated", async () => {
    const updatedCategory = {
      name: "Travel Expenses",
      status: false,
      userId: 1,
    };

    const result = await prisma.expenseCategory.update({
      where: { id: categoryId },
      data: updatedCategory,
    });

    expect(result.name).toBe(updatedCategory.name);
    expect(result.status).toBe(updatedCategory.status);
    expect(result.userId).toBe(updatedCategory.userId);
  });

  it("fails to update an expense category that does not exist", async () => {
    const invalidId = 999999;
    const updatedCategory = {
      name: "Invalid Category",
      status: false,
      userId: 1,
    };

    try {
      await prisma.expenseCategory.update({
        where: { id: invalidId },
        data: updatedCategory,
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("can get all expense categories", async () => {
    const allCategories = await prisma.expenseCategory.findMany();

    expect(allCategories).not.toBeNull();
    expect(allCategories.length).toBeGreaterThan(0);
  });

  it("can be deleted", async () => {
    const result = await prisma.expenseCategory.delete({
      where: { id: categoryId },
    });

    expect(result.id).toEqual(categoryId);
  });

  it("fails to delete an expense category that does not exist", async () => {
    const invalidId = 999999;

    try {
      await prisma.expenseCategory.delete({
        where: { id: invalidId },
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

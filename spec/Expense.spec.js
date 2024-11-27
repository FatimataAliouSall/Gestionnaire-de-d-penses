import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Expense Model Tests', () => {
  let expenseId = null;

  beforeAll(() => {
    spyOn(prisma.expense, 'create').and.callFake(async (data) => {
      return {
        id: 1,
        title: data.data.title,
        dateCreate: data.data.dateCreate,
        userId: data.data.userId,
        expenseCategoryId: data.data.expenseCategoryId,
      };
    });

    spyOn(prisma.expense, 'update').and.callFake(async (data) => {
      if (data.where.id === 1) {
        return { ...data.data, id: 1 };
      } else {
        throw new Error('Expense not found');
      }
    });

    spyOn(prisma.expense, 'findMany').and.callFake(async () => {
      return [
        {
          id: 1,
          title: 'Rent',
          userId: 1,
        },
      ];
    });

    spyOn(prisma.expense, 'delete').and.callFake(async (data) => {
      if (data.where.id === 1) {
        return { id: 1 };
      } else {
        throw new Error('Expense not found');
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('can be created', async () => {
    const expense = {
      title: 'Rent',
      dateCreate: new Date(),
      userId: 1,
      expenseCategoryId: 1,
    };
    const result = await prisma.expense.create({ data: expense });
    expenseId = result.id;

    expect(result).not.toBeNull();
    expect(result.title).toBe(expense.title);
  });

  it('can be updated', async () => {
    const updatedExpense = {
      title: 'Electricity',
    };
    const result = await prisma.expense.update({
      where: { id: expenseId },
      data: updatedExpense,
    });

    expect(result.title).toBe(updatedExpense.title);
    expect(result.amount).toBe(updatedExpense.amount);
  });

  it('fails to update an expense that does not exist', async () => {
    const updatedExpense = {
      title: 'Non-existent',
    };

    await expectAsync(
      prisma.expense.update({ where: { id: 9999 }, data: updatedExpense })
    ).toBeRejectedWithError('Expense not found');
  });

  it('can get all expenses', async () => {
    const result = await prisma.expense.findMany();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].title).toBe('Rent');
  });

  it('can be deleted', async () => {
    const result = await prisma.expense.delete({ where: { id: expenseId } });
    expect(result.id).toBe(expenseId);
  });

  it('fails to delete an expense that does not exist', async () => {
    await expectAsync(
      prisma.expense.delete({ where: { id: 9999 } })
    ).toBeRejectedWithError('Expense not found');
  });
});

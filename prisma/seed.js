import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

async function main() {
  await prisma.user.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.paymentMethod.deleteMany({});
  await prisma.planning.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.expenseCategory.deleteMany({});
  
  
  await prisma.planning.deleteMany({});

  const hashedPassword = await bcrypt.hash('password', SALT_ROUNDS);

  // Création des utilisateurs
  const user1 = await prisma.user.create({
    data: {
      username: 'adminUser',
      email: 'admin@example.com',
      password: hashedPassword, // Assurez-vous de hacher les mots de passe dans un cas réel
      role: Role.Admin,
      status: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'managerUser',
      email: 'manager@example.com',
      password: hashedPassword,
      role: Role.Menager,
      status: true,
    },
  });

  // Création de catégories de dépenses
  const category1 = await prisma.expenseCategory.create({
    data: {
      name: 'Category 1',
      status: true,
      userId: user1.id,
    },
  });

  const category2 = await prisma.expenseCategory.create({
    data: {
      name: 'Category 2',
      status: true,
      userId: user2.id,
    },
  });

  // Création de méthodes de paiement
  const paymentMethod1 = await prisma.paymentMethod.create({
    data: {
      name: 'Credit Card',
      status: true,
      userId: user1.id,
    },
  });

  const paymentMethod2 = await prisma.paymentMethod.create({
    data: {
      name: 'PayPal',
      status: true,
      userId: user2.id,
    },
  });

  // Création de dépenses
  const expense1 = await prisma.expense.create({
    data: {
      title: 'Expense 1',
      dateCreate: new Date(),
      userId: user1.id,
      expenseCategoryId: category1.id,
    },
  });

  const expense2 = await prisma.expense.create({
    data: {
      title: 'Expense 2',
      dateCreate: new Date(),
      userId: user2.id,
      expenseCategoryId: category2.id,
    },
  });

  // Création de plannings pour les dépenses
  const planning1 = await prisma.planning.create({
    data: {
      name: 'Planning 1',
      startDate: new Date(),
      endDate: new Date(),
      dueDate: new Date(),
      amount: 100.0,
      unit: 'USD',
      expenseId: expense1.id,
    },
  });

  const planning2 = await prisma.planning.create({
    data: {
      name: 'Planning 2',
      startDate: new Date(),
      endDate: new Date(),
      dueDate: new Date(),
      amount: 50.0,
      unit: 'USD',
      expenseId: expense2.id,
    },
  });

  // Création de paiements
  await prisma.payment.create({
    data: {
      amount: 100.0,
      unit: 'USD',
      paymentDate: new Date(),
      reference: 'Ref1234',
      userId: user1.id,
      planningId: planning1.id,
      paymentMethodId: paymentMethod1.id,
    },
  });

  await prisma.payment.create({
    data: {
      amount: 50.0,
      unit: 'USD',
      paymentDate: new Date(),
      reference: 'Ref5678',
      userId: user2.id,
      planningId: planning2.id,
      paymentMethodId: paymentMethod2.id,
    },
  });

  console.log('Seed data injected successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

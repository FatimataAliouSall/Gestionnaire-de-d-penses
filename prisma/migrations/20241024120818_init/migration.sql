-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseCategory" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ExpenseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "frequency" VARCHAR(50) NOT NULL,
    "dateCreate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "expenseCategoryId" INTEGER NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planning" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "expenseId" INTEGER NOT NULL,

    CONSTRAINT "Planning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "reference" VARCHAR(50) NOT NULL,
    "userId" INTEGER NOT NULL,
    "planningId" INTEGER NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,
    "expenseId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ExpenseCategory" ADD CONSTRAINT "ExpenseCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_expenseCategoryId_fkey" FOREIGN KEY ("expenseCategoryId") REFERENCES "ExpenseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planning" ADD CONSTRAINT "Planning_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "Planning"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

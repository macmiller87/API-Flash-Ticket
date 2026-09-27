-- CreateEnum
CREATE TYPE "UserAdmin" AS ENUM ('ADMIN', 'NOT_ADMIN');

-- CreateEnum
CREATE TYPE "EventsSectors" AS ENUM ('DYAMOND', 'PREMIUM', 'ECONOMIC');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admin" "UserAdmin" NOT NULL DEFAULT 'NOT_ADMIN',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "availableSectors" "EventsSectors" NOT NULL DEFAULT 'ECONOMIC',
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsPurchased" (
    "id" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "EventsPurchased_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "Users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_user_id_key" ON "Wallet"("user_id");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsPurchased" ADD CONSTRAINT "EventsPurchased_user_fkey" FOREIGN KEY ("user") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

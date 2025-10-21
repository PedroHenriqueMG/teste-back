-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('pix', 'creditCard', 'bankSlip');

-- CreateEnum
CREATE TYPE "ChargeStatus" AS ENUM ('pending', 'paid', 'failed', 'canceled');

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charge" (
    "id" TEXT NOT NULL,
    "custumer_id" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "coin" TEXT NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "status" "ChargeStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_document_key" ON "Customer"("document");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_custumer_id_fkey" FOREIGN KEY ("custumer_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

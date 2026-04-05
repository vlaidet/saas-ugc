-- CreateTable
CREATE TABLE "brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "profileUrl" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "product" TEXT,
    "status" TEXT NOT NULL DEFAULT 'À contacter',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_contact" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "channel" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "brand_userId_idx" ON "brand"("userId");

-- CreateIndex
CREATE INDEX "brand_contact_brandId_idx" ON "brand_contact"("brandId");

-- AddForeignKey
ALTER TABLE "brand" ADD CONSTRAINT "brand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_contact" ADD CONSTRAINT "brand_contact_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

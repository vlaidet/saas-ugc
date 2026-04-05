-- CreateTable
CREATE TABLE "message_template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "niche" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "timesReplied" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_variable" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custom_variable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "message_template_userId_idx" ON "message_template"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "custom_variable_userId_key_key" ON "custom_variable"("userId", "key");

-- CreateIndex
CREATE INDEX "custom_variable_userId_idx" ON "custom_variable"("userId");

-- AddForeignKey
ALTER TABLE "message_template" ADD CONSTRAINT "message_template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_variable" ADD CONSTRAINT "custom_variable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

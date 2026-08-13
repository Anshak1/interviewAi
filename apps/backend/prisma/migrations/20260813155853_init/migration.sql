-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pre', 'processing', 'done');

-- CreateEnum
CREATE TYPE "who" AS ENUM ('model', 'person');

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pre',
    "meatadata" TEXT NOT NULL,
    "score" INTEGER,
    "feedback" TEXT,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "who" "who" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interviewId" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

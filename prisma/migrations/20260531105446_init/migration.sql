-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "salary" TEXT,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "sourceJobId" TEXT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "postedAt" DATETIME NOT NULL,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_sourceJobId_key" ON "Job"("sourceJobId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobUrl_key" ON "Job"("jobUrl");

-- CreateIndex
CREATE INDEX "Job_title_idx" ON "Job"("title");

-- CreateIndex
CREATE INDEX "Job_location_idx" ON "Job"("location");

-- CreateIndex
CREATE INDEX "Job_postedAt_idx" ON "Job"("postedAt");

-- CreateIndex
CREATE INDEX "Job_jobUrl_idx" ON "Job"("jobUrl");

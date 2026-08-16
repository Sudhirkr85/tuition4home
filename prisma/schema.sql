-- TuitionForHome MySQL Complete Database Schema (Compatible with Hostinger phpMyAdmin)

-- 1. Create User Table
CREATE TABLE IF NOT EXISTS `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `passwordHash` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `image` LONGTEXT NULL,
    `role` ENUM('SUPER_ADMIN', 'TELECALLER', 'TUTOR', 'PARENT') NOT NULL DEFAULT 'PARENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    INDEX `User_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Create EmailOtpToken Table
CREATE TABLE IF NOT EXISTS `EmailOtpToken` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `otpCode` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'LOGIN_REGISTER',
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `EmailOtpToken_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Create TutorProfile Table
CREATE TABLE IF NOT EXISTS `TutorProfile` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `avatarUrl` LONGTEXT NULL,
    `introVideoUrl` LONGTEXT NULL,
    `videoThumbnailUrl` LONGTEXT NULL,
    `bio` TEXT NULL,
    `experienceYears` INTEGER NOT NULL DEFAULT 0,
    `highestDegree` VARCHAR(191) NULL,
    `qualifications` TEXT NULL,
    `experiences` TEXT NULL,
    `teachingMode` ENUM('OFFLINE_HOME', 'ONLINE_LIVE', 'BOTH') NOT NULL DEFAULT 'BOTH',
    `subjects` VARCHAR(191) NULL,
    `classes` VARCHAR(191) NULL,
    `boards` VARCHAR(191) NULL,
    `serviceAreas` VARCHAR(191) NULL,
    `travelRadiusKm` INTEGER NOT NULL DEFAULT 5,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `formattedAddress` VARCHAR(191) NULL,
    `availableSlots` VARCHAR(191) NULL,
    `hourlyRateHome` INTEGER NULL,
    `hourlyRateOnline` INTEGER NULL,
    `hourlyRateHomeMin` INTEGER NULL,
    `hourlyRateHomeMax` INTEGER NULL,
    `hourlyRateOnlineMin` INTEGER NULL,
    `hourlyRateOnlineMax` INTEGER NULL,
    `monthlyRateMin` INTEGER NULL,
    `status` ENUM('DRAFT', 'PENDING_INTERVIEW', 'INTERVIEW_SCHEDULED', 'ACTIVE_VERIFIED', 'SUSPENDED', 'REJECTED') NOT NULL DEFAULT 'PENDING_INTERVIEW',
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `hasPoliceCheck` BOOLEAN NOT NULL DEFAULT false,
    `interviewScore` INTEGER NULL,
    `interviewNotes` TEXT NULL,
    `rating` DOUBLE NOT NULL DEFAULT 5.0,
    `totalReviews` INTEGER NOT NULL DEFAULT 0,
    `reliabilityScore` INTEGER NOT NULL DEFAULT 100,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TutorProfile_userId_key`(`userId`),
    INDEX `TutorProfile_status_idx`(`status`),
    INDEX `TutorProfile_isVerified_idx`(`isVerified`),
    INDEX `TutorProfile_teachingMode_idx`(`teachingMode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 4. Create TutorKYC Table
CREATE TABLE IF NOT EXISTS `TutorKYC` (
    `id` VARCHAR(191) NOT NULL,
    `tutorId` VARCHAR(191) NOT NULL,
    `idType` VARCHAR(191) NOT NULL,
    `idLast4` VARCHAR(191) NOT NULL,
    `idNumberEncrypted` VARCHAR(191) NULL,
    `idDocUrl` LONGTEXT NOT NULL,
    `idStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `idRejectionNote` TEXT NULL,
    `degreeDocUrl` LONGTEXT NULL,
    `degreeStatus` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `degreeRejectionNote` TEXT NULL,
    `verificationDate` DATETIME(3) NULL,
    `verifiedByAdmin` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TutorKYC_tutorId_key`(`tutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 5. Create Lead Table
CREATE TABLE IF NOT EXISTS `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `parentId` VARCHAR(191) NULL,
    `studentName` VARCHAR(191) NULL,
    `parentName` VARCHAR(191) NOT NULL,
    `parentPhone` VARCHAR(191) NOT NULL,
    `parentEmail` VARCHAR(191) NULL,
    `preferredMode` ENUM('OFFLINE_HOME', 'ONLINE_LIVE', 'BOTH') NOT NULL DEFAULT 'OFFLINE_HOME',
    `locality` VARCHAR(191) NOT NULL,
    `formattedAddress` VARCHAR(191) NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `gradeClass` VARCHAR(191) NOT NULL,
    `subjectsNeeded` VARCHAR(191) NOT NULL,
    `board` VARCHAR(191) NOT NULL,
    `budgetMonthly` INTEGER NULL,
    `genderPreference` VARCHAR(191) NULL,
    `status` ENUM('NEW_LEAD', 'CONTACTED', 'INTERESTED', 'CALL_SCHEDULED', 'TUTOR_MATCHED', 'DEMO_SCHEDULED', 'DEMO_COMPLETED', 'TUITION_CONFIRMED', 'COMMISSION_RECEIVED', 'LOST') NOT NULL DEFAULT 'NEW_LEAD',
    `assignedCallerId` VARCHAR(191) NULL,
    `assignedTutorId` VARCHAR(191) NULL,
    `demoDate` DATETIME(3) NULL,
    `commissionAmount` INTEGER NULL,
    `isTwoSplit` BOOLEAN NOT NULL DEFAULT false,
    `isCommissionPaid` BOOLEAN NOT NULL DEFAULT false,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    INDEX `Lead_status_idx`(`status`),
    INDEX `Lead_locality_idx`(`locality`),
    INDEX `Lead_preferredMode_idx`(`preferredMode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 6. Create LeadActivity Table
CREATE TABLE IF NOT EXISTS `LeadActivity` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NOT NULL,
    `actionType` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `performedBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LeadActivity_leadId_idx`(`leadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 7. Create Review Table
CREATE TABLE IF NOT EXISTS `Review` (
    `id` VARCHAR(191) NOT NULL,
    `tutorId` VARCHAR(191) NOT NULL,
    `reviewerId` VARCHAR(191) NULL,
    `parentName` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `isApproved` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Review_tutorId_idx`(`tutorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 8. Create LocalitySEO Table
CREATE TABLE IF NOT EXISTS `LocalitySEO` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL DEFAULT 'Gurgaon',
    `pincode` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NOT NULL,
    `metaDesc` TEXT NOT NULL,
    `h1Heading` VARCHAR(191) NOT NULL,
    `contentBody` TEXT NULL,
    `faqs` TEXT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `LocalitySEO_slug_key`(`slug`),
    INDEX `LocalitySEO_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 9. Create PlatformConfig Table
CREATE TABLE IF NOT EXISTS `PlatformConfig` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'global_config',
    `baseVerificationFee` INTEGER NOT NULL DEFAULT 999,
    `isOfferActive` BOOLEAN NOT NULL DEFAULT true,
    `offerDiscountPercent` INTEGER NOT NULL DEFAULT 100,
    `offerTitle` VARCHAR(191) NOT NULL DEFAULT 'Academic Session Special Drive',
    `offerSubtext` VARCHAR(191) NOT NULL DEFAULT '100% Verification Fee Waiver for Gurgaon & NCR Educators',
    `officeAddress` VARCHAR(191) NOT NULL DEFAULT 'M24 Ground Floor, Old DLF Colony, Sector 14, Gurugram, Haryana 122001',
    `helplinePhones` VARCHAR(191) NOT NULL DEFAULT '+91 92170 31899',
    `supportEmail` VARCHAR(191) NOT NULL DEFAULT 'info@sssamacademy.com',
    `mapProvider` VARCHAR(191) NOT NULL DEFAULT 'GOOGLE_MAPS',
    `googleMapsApiKey` VARCHAR(191) NULL,
    `googleMapsUsageCount` INTEGER NOT NULL DEFAULT 0,
    `googleMapsLimit` INTEGER NOT NULL DEFAULT 25000,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign Keys Configuration
ALTER TABLE `TutorProfile` ADD CONSTRAINT `TutorProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `TutorKYC` ADD CONSTRAINT `TutorKYC_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `TutorProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_assignedCallerId_fkey` FOREIGN KEY (`assignedCallerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_assignedTutorId_fkey` FOREIGN KEY (`assignedTutorId`) REFERENCES `TutorProfile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `LeadActivity` ADD CONSTRAINT `LeadActivity_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Review` ADD CONSTRAINT `Review_tutorId_fkey` FOREIGN KEY (`tutorId`) REFERENCES `TutorProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Review` ADD CONSTRAINT `Review_reviewerId_fkey` FOREIGN KEY (`reviewerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

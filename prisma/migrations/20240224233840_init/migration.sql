-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `dob` VARCHAR(191) NULL,
    `governorate` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `is_blocked` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `student_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `parent_phone` VARCHAR(191) NULL,
    `parent_phone2` VARCHAR(191) NULL,

    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `teacher_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`teacher_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `class_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `subject_id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `subject_name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courses` (
    `course_id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `course_name` VARCHAR(191) NOT NULL,
    `course_price` DOUBLE NOT NULL,
    `course_desc` VARCHAR(191) NULL,
    `course_image_url` VARCHAR(191) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `courses_course_name_key`(`course_name`),
    PRIMARY KEY (`course_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `course_enrollments` (
    `enrollment_number` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`enrollment_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_installments` (
    `installment_number` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `due_date` DATETIME(3) NOT NULL,
    `paid_amount` DOUBLE NOT NULL,
    `paid_date` DATETIME(3) NULL,
    `old_amount` DOUBLE NULL,
    `is_paid` BOOLEAN NOT NULL DEFAULT false,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`installment_number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_enrollments` ADD CONSTRAINT `course_enrollments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `course_enrollments` ADD CONSTRAINT `course_enrollments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_installments` ADD CONSTRAINT `student_installments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_installments` ADD CONSTRAINT `student_installments_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `courses`(`course_id`) ON DELETE CASCADE ON UPDATE CASCADE;

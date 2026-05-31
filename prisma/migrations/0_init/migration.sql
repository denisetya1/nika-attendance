-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'employee',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendace_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "date_string" TEXT NOT NULL,
    "check_in_time" TIMESTAMP(3) NOT NULL,
    "check_in_time_str" TEXT NOT NULL,
    "check_out_time" TIMESTAMP(3),
    "check_out_time_str" TEXT,
    "photo_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "photo_url_checkout" TEXT,

    CONSTRAINT "attendace_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forgot_password" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "trx_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forgot_password_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "attendace_records_date_string_user_id_idx" ON "attendace_records"("date_string", "user_id");

-- CreateIndex
CREATE INDEX "forgot_password_trx_id_token_idx" ON "forgot_password"("trx_id", "token");

-- AddForeignKey
ALTER TABLE "attendace_records" ADD CONSTRAINT "attendace_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forgot_password" ADD CONSTRAINT "forgot_password_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


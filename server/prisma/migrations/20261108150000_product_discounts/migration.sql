ALTER TABLE "Product"
ADD COLUMN "discountType" TEXT,
ADD COLUMN "discountValue" DECIMAL(65,30);

ALTER TABLE "Product" ADD CONSTRAINT "Product_discount_valid" CHECK (
  CASE
    WHEN "discountType" IS NULL THEN "discountValue" IS NULL
    WHEN "discountType" = 'PERCENT' THEN "discountValue" IS NOT NULL AND "discountValue" > 0 AND "discountValue" < 100
    WHEN "discountType" = 'FIXED' THEN "discountValue" IS NOT NULL AND "discountValue" > 0 AND "discountValue" < "price"
    ELSE FALSE
  END
);

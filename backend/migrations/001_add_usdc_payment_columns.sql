-- Migration: Add USDC Payment columns to orders table
-- Date: 2026-08-13
-- Purpose: Add paymentTxHash, mintTxHash, and paymentVerifiedAt columns for USDC payment flow

IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'paymentTxHash'
)
BEGIN
    ALTER TABLE [dbo].[orders] 
    ADD [paymentTxHash] NVARCHAR(MAX) NULL;
    PRINT 'Added column: paymentTxHash';
END;

IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'mintTxHash'
)
BEGIN
    ALTER TABLE [dbo].[orders] 
    ADD [mintTxHash] NVARCHAR(MAX) NULL;
    PRINT 'Added column: mintTxHash';
END;

IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'paymentVerifiedAt'
)
BEGIN
    ALTER TABLE [dbo].[orders] 
    ADD [paymentVerifiedAt] DATETIME NULL;
    PRINT 'Added column: paymentVerifiedAt';
END;

PRINT 'Migration completed successfully!';

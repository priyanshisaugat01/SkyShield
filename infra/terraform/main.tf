# -----------------------------------------------------------------------------
# SKYSHIELD S3 STORAGE
# -----------------------------------------------------------------------------

resource "aws_s3_bucket" "demo" {
  bucket = var.demo_bucket_name

  tags = {
    Name = var.demo_bucket_name
  }
}

# -----------------------------------------------------------------------------
# Logging Bucket
# -----------------------------------------------------------------------------

resource "aws_s3_bucket" "logs" {
  bucket = "${var.demo_bucket_name}-logs"

  tags = {
    Name = "${var.demo_bucket_name}-logs"
  }
}

resource "aws_s3_bucket_public_access_block" "logs" {
  bucket = aws_s3_bucket.logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.logs.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# -----------------------------------------------------------------------------
# Ownership Controls
# -----------------------------------------------------------------------------

resource "aws_s3_bucket_ownership_controls" "demo" {
  bucket = aws_s3_bucket.demo.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# -----------------------------------------------------------------------------
# Block Public Access
# -----------------------------------------------------------------------------

resource "aws_s3_bucket_public_access_block" "demo" {
  bucket = aws_s3_bucket.demo.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# -----------------------------------------------------------------------------
# Versioning
# -----------------------------------------------------------------------------

resource "aws_s3_bucket_versioning" "demo" {
  bucket = aws_s3_bucket.demo.id

  versioning_configuration {
    status = "Enabled"
  }
}

# -----------------------------------------------------------------------------
# KMS Key
# -----------------------------------------------------------------------------

resource "aws_kms_key" "s3" {
  description             = "SkyShield S3 Encryption Key"
  deletion_window_in_days = 7

  tags = {
    Name = "skyshield-s3-key"
  }
}

# -----------------------------------------------------------------------------
# Encryption
# -----------------------------------------------------------------------------

resource "aws_s3_bucket_server_side_encryption_configuration" "demo" {
  bucket = aws_s3_bucket.demo.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.s3.arn
      sse_algorithm     = "aws:kms"
    }
  }
}

# -----------------------------------------------------------------------------
# Lifecycle Rule
# -----------------------------------------------------------------------------

resource "aws_s3_bucket_lifecycle_configuration" "demo" {
  bucket = aws_s3_bucket.demo.id

  rule {
    id     = "cleanup"
    status = "Enabled"

    filter {}

    expiration {
      days = 365
    }
  }
}

# -----------------------------------------------------------------------------
# Access Logging
# -----------------------------------------------------------------------------

resource "aws_s3_bucket_logging" "demo" {
  bucket = aws_s3_bucket.demo.id

  target_bucket = aws_s3_bucket.logs.id
  target_prefix = "access-logs/"
}
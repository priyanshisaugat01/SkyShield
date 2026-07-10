# -----------------------------------------------------------------------------
# COMPLIANCE DEMO BUCKET.
#
# Phase 2 deliberately created this S3 bucket with public access enabled so
# Checkov (see .github/workflows/checkov.yml) had a real finding to catch.
# Phase 3 remediates every one of those findings below, following AWS S3
# security best practices. This bucket is now the reference example of how
# storage should be configured across this project.
# -----------------------------------------------------------------------------

resource "aws_s3_bucket" "demo" {
  bucket = var.demo_bucket_name
}

# SECURITY: Object Ownership set to "BucketOwnerEnforced" disables ACLs
# entirely — access is controlled only through IAM/bucket policy, which is
# the AWS-recommended posture and removes the ACL-based public-access vector
# that Phase 2 relied on (fixes CKV_AWS_20 / public-read ACL).
resource "aws_s3_bucket_ownership_controls" "demo" {
  bucket = aws_s3_bucket.demo.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# SECURITY: Block Public Access is fully enabled on all four settings,
# guaranteeing the bucket cannot be made public via ACL or bucket policy,
# even by accident (fixes CKV_AWS_53 / CKV_AWS_54 / CKV_AWS_55 / CKV_AWS_56
# and CKV2_AWS_6).
resource "aws_s3_bucket_public_access_block" "demo" {
  bucket = aws_s3_bucket.demo.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# SECURITY: Versioning is enabled so every object revision is retained,
# protecting against accidental overwrite/deletion and supporting recovery
# (fixes CKV_AWS_21).
resource "aws_s3_bucket_versioning" "demo" {
  bucket = aws_s3_bucket.demo.id

  versioning_configuration {
    status = "Enabled"
  }
}

# SECURITY: Server-side encryption is enforced by default using AES256, so
# every object is encrypted at rest even if a caller never requests it
# explicitly (fixes CKV_AWS_19 / bucket encryption not enabled). Swap
# sse_algorithm to "aws:kms" with a customer-managed key ID here if the
# compliance requirement calls for KMS-managed keys instead of SSE-S3.
resource "aws_s3_bucket_server_side_encryption_configuration" "demo" {
  bucket = aws_s3_bucket.demo.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

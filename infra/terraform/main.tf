# -----------------------------------------------------------------------------
# INTENTIONALLY INSECURE RESOURCE — DO NOT USE IN PRODUCTION.
#
# This S3 bucket is deliberately misconfigured to allow public access. It
# exists purely as a scan target for educational purposes, so that Checkov
# (see .github/workflows/checkov.yml) has a real, known finding to detect
# and fail the pipeline on — proving the IaC security gate works end to end.
#
# Expected Checkov findings include (non-exhaustive):
#   - CKV_AWS_53 / CKV_AWS_54 / CKV_AWS_55 / CKV_AWS_56 (public access block
#     settings disabled)
#   - CKV_AWS_20  (bucket ACL allows public read)
#   - CKV_AWS_21  (versioning not enabled)
#   - CKV2_AWS_6  (no public access block restricting the bucket)
#
# Do not "fix" this resource — its insecurity is the point. Any real bucket
# in this project should follow the opposite pattern (block all public
# access, enable versioning and encryption).
# -----------------------------------------------------------------------------

resource "aws_s3_bucket" "insecure_demo" {
  bucket = var.insecure_bucket_name
}

# Object Ownership must allow ACLs for the public-read ACL below to apply.
# This is only set for the sake of this deliberately-insecure demo.
resource "aws_s3_bucket_ownership_controls" "insecure_demo" {
  bucket = aws_s3_bucket.insecure_demo.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# INSECURE ON PURPOSE: every public-access protection AWS provides is
# explicitly disabled here so Checkov flags it.
resource "aws_s3_bucket_public_access_block" "insecure_demo" {
  bucket = aws_s3_bucket.insecure_demo.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# INSECURE ON PURPOSE: grants public-read access to the bucket.
resource "aws_s3_bucket_acl" "insecure_demo" {
  bucket = aws_s3_bucket.insecure_demo.id
  acl    = "public-read"

  depends_on = [
    aws_s3_bucket_ownership_controls.insecure_demo,
    aws_s3_bucket_public_access_block.insecure_demo,
  ]
}

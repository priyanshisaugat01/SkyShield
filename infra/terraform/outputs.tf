output "insecure_demo_bucket_id" {
  description = "ID of the intentionally insecure demo S3 bucket (Checkov scan target)."
  value       = aws_s3_bucket.insecure_demo.id
}

output "insecure_demo_bucket_arn" {
  description = "ARN of the intentionally insecure demo S3 bucket (Checkov scan target)."
  value       = aws_s3_bucket.insecure_demo.arn
}

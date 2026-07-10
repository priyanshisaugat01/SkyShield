output "demo_bucket_id" {
  description = "ID of the demo S3 bucket (Checkov scan target)."
  value       = aws_s3_bucket.demo.id
}

output "demo_bucket_arn" {
  description = "ARN of the demo S3 bucket (Checkov scan target)."
  value       = aws_s3_bucket.demo.arn
}

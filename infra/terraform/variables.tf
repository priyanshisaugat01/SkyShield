variable "aws_region" {
  description = "AWS region to deploy resources into."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming and tagging."
  type        = string
  default     = "skyshield"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "insecure_bucket_name" {
  description = "Globally unique name for the intentionally insecure demo S3 bucket used as a Checkov scan target."
  type        = string
  default     = "skyshield-insecure-demo-bucket"
}

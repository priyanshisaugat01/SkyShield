terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state (S3 backend + DynamoDB lock table) will be introduced once
  # the storage/observability phase provisions the supporting resources.
  # Using local state for this initial IaC-scanning milestone is intentional.
}

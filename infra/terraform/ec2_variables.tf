# -----------------------------------------------------------------------------
# Phase 6 (EC2) — variables scoped to the demo EC2 instance. Kept in a
# dedicated file so previous-phase files (variables.tf, networking_variables.tf)
# are not touched.
# -----------------------------------------------------------------------------

variable "ec2_instance_type" {
  description = "Instance type for the demo Amazon Linux 2023 EC2 instance."
  type        = string
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "Name of an EC2 key pair that must already exist in this AWS account/region. Terraform does not create it — only references it."
  type        = string
  default     = "skyshield-key"
}

variable "ec2_environment_tag" {
  description = "Value applied to the Environment tag on the Phase 6 EC2 resources."
  type        = string
  default     = "Dev"
}

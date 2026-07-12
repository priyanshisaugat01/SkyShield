# -----------------------------------------------------------------------------
# Phase 6 — variables scoped to custom networking. Kept in a dedicated file
# so previous-phase files (variables.tf, etc.) are not touched.
# -----------------------------------------------------------------------------

variable "vpc_cidr" {
  description = "CIDR block for the SkyShield custom VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets, one per AZ."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for the private subnets, one per AZ."
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

variable "network_project_tag" {
  description = "Value applied to the Project tag on every Phase 6 networking resource."
  type        = string
  default     = "SkyShield"
}

variable "ssh_ingress_cidr" {
  description = "CIDR block allowed to reach SSH (22) on the demo security group. Open to the internet by default for demo purposes only — restrict to a known IP range before using this in production."
  type        = string
  default     = "0.0.0.0/0"
}

variable "http_ingress_cidr" {
  description = "CIDR block allowed to reach HTTP (80) on the demo security group."
  type        = string
  default     = "0.0.0.0/0"
}

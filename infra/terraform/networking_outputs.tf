# -----------------------------------------------------------------------------
# Phase 6 — outputs scoped to custom networking. Kept in a dedicated file so
# previous-phase outputs.tf is not modified.
# -----------------------------------------------------------------------------

output "vpc_id" {
  description = "ID of the Phase 6 custom VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets."
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets."
  value       = aws_subnet.private[*].id
}

output "internet_gateway_id" {
  description = "ID of the Internet Gateway attached to the VPC."
  value       = aws_internet_gateway.main.id
}

output "web_ssh_security_group_id" {
  description = "ID of the security group allowing SSH (22) and HTTP (80)."
  value       = aws_security_group.web_ssh.id
}

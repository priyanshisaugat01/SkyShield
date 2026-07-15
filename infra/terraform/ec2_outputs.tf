# -----------------------------------------------------------------------------
# Phase 6 (EC2) — outputs scoped to the demo EC2 instance. Kept in a
# dedicated file so previous-phase outputs.tf / networking_outputs.tf are
# not modified.
# -----------------------------------------------------------------------------

output "ec2_instance_id" {
  description = "ID of the Phase 6 demo EC2 instance."
  value       = aws_instance.demo.id
}

output "ec2_public_ip" {
  description = "Public IP address of the demo EC2 instance."
  value       = aws_instance.demo.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the demo EC2 instance."
  value       = aws_instance.demo.public_dns
}

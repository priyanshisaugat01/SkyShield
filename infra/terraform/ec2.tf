resource "aws_instance" "demo" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.web_ssh.id]
  key_name               = data.aws_key_pair.existing.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_cloudwatch.name

  # ✅ Enable detailed monitoring
  monitoring = true

  # ✅ Enable IMDSv2 only
  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  # ✅ Encrypt root EBS volume
  root_block_device {
    encrypted = true
  }

  # ✅ Enable EBS optimization
  ebs_optimized = true

  tags = {
    Project     = var.network_project_tag
    Environment = var.ec2_environment_tag
    Name        = "${var.project_name}-demo-instance"
  }
}
# -----------------------------------------------------------------------------
# PHASE 6 (EC2) — EC2 INSTANCE + IAM ROLE FOR CLOUDWATCH + INSTANCE PROFILE.
#
# Launches one Amazon Linux 2023 instance into the existing public subnet and
# security group created by the networking phase (networking.tf). Nothing in
# networking.tf is modified or recreated here — this file only references
# those resources (aws_subnet.public, aws_security_group.web_ssh) by their
# existing addresses.
#
# The key pair named by var.key_pair_name ("skyshield-key" by default) must
# already exist in this AWS account/region. Terraform does not create it —
# the data source below only looks it up, and fails the plan if it's missing.
# -----------------------------------------------------------------------------

data "aws_key_pair" "existing" {
  key_name = var.key_pair_name
}

data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Minimum permissions for CloudWatch: the AWS-managed
# CloudWatchAgentServerPolicy lets the instance publish its own
# metrics/logs and read its own agent configuration from SSM Parameter
# Store — nothing beyond that.
resource "aws_iam_role" "ec2_cloudwatch" {
  name = "${var.project_name}-ec2-cloudwatch-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project     = var.network_project_tag
    Environment = var.ec2_environment_tag
  }
}

resource "aws_iam_role_policy_attachment" "ec2_cloudwatch" {
  role       = aws_iam_role.ec2_cloudwatch.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_instance_profile" "ec2_cloudwatch" {
  name = "${var.project_name}-ec2-cloudwatch-profile"
  role = aws_iam_role.ec2_cloudwatch.name

  tags = {
    Project     = var.network_project_tag
    Environment = var.ec2_environment_tag
  }
}

resource "aws_instance" "demo" {
  ami                    = data.aws_ami.amazon_linux_2023.id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public[0].id
  vpc_security_group_ids = [aws_security_group.web_ssh.id]
  key_name               = data.aws_key_pair.existing.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_cloudwatch.name

  tags = {
    Project     = var.network_project_tag
    Environment = var.ec2_environment_tag
    Name        = "${var.project_name}-demo-instance"
  }
}

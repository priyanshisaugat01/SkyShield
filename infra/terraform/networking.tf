# -----------------------------------------------------------------------------
# PHASE 6 — CUSTOM AWS NETWORKING.
#
# A custom VPC with 2 public + 2 private subnets, an Internet Gateway, public
# and private route tables with their associations, and a security group for
# SSH/HTTP. No networking resources (VPC, subnet, IGW, route table, NAT
# gateway, or security group) existed anywhere in this project before this
# phase — confirmed by grepping infra/terraform for those resource types.
#
# This file, networking_variables.tf, and networking_outputs.tf are additive
# only. No previous-phase file (main.tf, variables.tf, outputs.tf,
# providers.tf, versions.tf) is modified.
#
# A NAT Gateway was checked for (also absent) but is intentionally NOT
# created here — it wasn't part of this phase's requested resource list, so
# the private route table has no outbound internet route yet.
# -----------------------------------------------------------------------------

# Look up AZs dynamically instead of hardcoding names, so this configuration
# stays portable if var.aws_region ever changes.
data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  network_azs = slice(data.aws_availability_zones.available.names, 0, 2)

  # Merged into every Phase 6 resource's tags, in addition to the provider's
  # own default_tags (which already apply Project = var.project_name).
  network_tags = {
    Project = var.network_project_tag
  }
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = merge(local.network_tags, {
    Name = "${var.project_name}-vpc"
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(local.network_tags, {
    Name = "${var.project_name}-igw"
  })
}

resource "aws_subnet" "public" {
  count                   = length(var.public_subnet_cidrs)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = local.network_azs[count.index]
  map_public_ip_on_launch = true

  tags = merge(local.network_tags, {
    Name = "${var.project_name}-public-${count.index + 1}"
  })
}

resource "aws_subnet" "private" {
  count             = length(var.private_subnet_cidrs)
  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = local.network_azs[count.index]

  tags = merge(local.network_tags, {
    Name = "${var.project_name}-private-${count.index + 1}"
  })
}

# Public route table: default route out to the internet via the IGW.
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(local.network_tags, {
    Name = "${var.project_name}-public-rt"
  })
}

resource "aws_route_table_association" "public" {
  count          = length(aws_subnet.public)
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Private route table: no default route in this phase (no NAT Gateway was
# requested), so these subnets have no outbound internet path yet.
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = merge(local.network_tags, {
    Name = "${var.project_name}-private-rt"
  })
}

resource "aws_route_table_association" "private" {
  count          = length(aws_subnet.private)
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# Security group allowing inbound SSH (22) and HTTP (80). Both ingress CIDRs
# default to 0.0.0.0/0 for demo purposes — this is a real, known Checkov
# finding (CKV_AWS_24: unrestricted SSH ingress), left open intentionally so
# it's visible rather than hidden. Override ssh_ingress_cidr / http_ingress_cidr
# to a narrower range before applying this in any non-demo environment.
resource "aws_security_group" "web_ssh" {
  name        = "${var.project_name}-web-ssh-sg"
  description = "Allow inbound SSH (22) and HTTP (80)"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_ingress_cidr]
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [var.http_ingress_cidr]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.network_tags, {
    Name = "${var.project_name}-web-ssh-sg"
  })
}

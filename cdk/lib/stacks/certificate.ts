import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib/core';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';

interface CertificateStackProps extends StackProps {
  readonly stage: string;
  readonly hostedZone: IHostedZone;
  readonly websiteSubdomain: string;
}

export class CertificateStack extends Stack {
  public readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props: CertificateStackProps) {
    super(scope, id, {
      ...props,
      crossRegionReferences: true,
    });

    this.certificate = new Certificate(this, 'WebsiteCertificate', {
      domainName: props.websiteSubdomain + props.hostedZone.zoneName,
      validation: CertificateValidation.fromDns(props.hostedZone),
    });
  }
}

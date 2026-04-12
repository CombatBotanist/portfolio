import { Construct } from 'constructs';
import { WebsiteStack } from '../stacks/website';
import { Stage, StageProps } from 'aws-cdk-lib/core';
import { HostedZoneStack } from '../stacks/hostedZone';
import { CertificateStack } from '../stacks/certificate';

interface DeployStageProps extends StageProps {
  readonly stage: string;
}

export class DeployStage extends Stage {
  constructor(scope: Construct, id: string, props: DeployStageProps) {
    super(scope, id, props);

    const websiteSubdomain = 'portfolio';

    const hostedZoneStack = new HostedZoneStack(this, 'HostedZone', {
      ...props,
    });

    const certificateStack = new CertificateStack(this, 'Certificate', {
      ...props,
      env: { ...props.env, region: 'us-east-1' },
      hostedZone: hostedZoneStack.hosteZone,
      websiteSubdomain,
    });

    new WebsiteStack(this, props.stage + 'Website', {
      ...props,
      hostedZone: hostedZoneStack.hosteZone,
      certificate: certificateStack.certificate,
      websiteSubdomain,
    });
  }
}

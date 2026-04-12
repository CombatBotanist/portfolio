import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib/core';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';

interface HostedZoneStackProps extends StackProps {
  readonly stage: string;
}

export class HostedZoneStack extends Stack {
  public readonly hosteZone: IHostedZone;

  constructor(scope: Construct, id: string, props: HostedZoneStackProps) {
    super(scope, id, props);

    this.hosteZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      zoneName: 'jguy.net',
      hostedZoneId: 'Z0843933BX943M8YM763',
    });
  }
}

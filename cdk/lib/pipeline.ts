import { Construct } from 'constructs';
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from 'aws-cdk-lib/pipelines';
import { SecretValue, Stack, StackProps } from 'aws-cdk-lib/core';
import { DeployStage } from './stages/DeployStage';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'PortfolioCdkPipeline', {
      pipelineName: 'PortfolioPipeline',
      synth: new ShellStep('BuildCdk', {
        input: CodePipelineSource.gitHub('CombatBotanist/portfolio', 'main', {
          authentication: SecretValue.secretsManager(
            'github/CombatBotanist/portfolio',
          ),
        }),
        primaryOutputDirectory: 'cdk/cdk.out',
        commands: [
          'cd website',
          'npm ci',
          'npm run build',
          'cd ../cdk',
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    pipeline.addStage(
      new DeployStage(this, 'Dev', {
        env: { account: '911967969946', region: 'us-west-2' },
        stage: 'Dev',
      }),
    );
  }
}

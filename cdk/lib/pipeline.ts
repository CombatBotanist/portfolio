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

    const source = CodePipelineSource.gitHub(
      'CombatBotanist/portfolio',
      'main',
      {
        authentication: SecretValue.secretsManager(
          'github/CombatBotanist/portfolio',
        ),
      },
    );

    const websiteBuild = new ShellStep('BuildWebsite', {
      input: source,
      primaryOutputDirectory: 'website/dist',
      commands: ['n 24', 'cd website', 'npm ci', 'npm run build'],
    });

    const pipeline = new CodePipeline(this, 'PortfolioCdkPipeline', {
      pipelineName: 'PortfolioPipeline',
      synth: new ShellStep('BuildCdk', {
        input: source,
        additionalInputs: { 'website/dist': websiteBuild },
        primaryOutputDirectory: 'cdk/cdk.out',
        commands: ['cd cdk', 'npm ci', 'npm run build', 'npx cdk synth'],
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

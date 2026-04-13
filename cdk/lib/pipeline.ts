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
      selfMutation: true,
      synth: new ShellStep('Build', {
        input: CodePipelineSource.gitHub('CombatBotanist/portfolio', 'main', {
          authentication: SecretValue.secretsManager(
            'github/CombatBotanist/portfolio',
          ),
        }),
        primaryOutputDirectory: 'cdk/cdk.out',
        commands: [
          'n 24',
          'cd website',
          'npm i',
          'npm run build',
          'cd ../cdk',
          'npm i',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    // Dev
    pipeline.addStage(
      new DeployStage(this, 'Dev', {
        env: { account: '911967969946', region: 'us-west-2' },
        stage: 'Dev',
      }),
    );
  }
}

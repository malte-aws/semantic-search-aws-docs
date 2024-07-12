import {Args, Command, Flags} from '@oclif/core'
import {DownloadRepo} from '../deployables/downloadRepo';
import {printer, prompter} from 'amplify-prompts';
import { SemanticSearchConfig, defaultConfig, defaultConfig as semanticSearchDefaultConfig } from '../semanticSearchConfig';
import { Deployer } from '../deployables/deployer';
import { AvailableDiskSpaceInBytes } from '../queryables/availableDiskSpaceInBytes';
import { FindRepo } from '../queryables/findRepo';
import { EnvironmentDefinition, complete } from '../queryables/environmentDefinition';
import { cwd } from 'process';
import { TerraformBackendQuery } from '../queryables/terraformBackendQuery';
import { EnvironmentQuery } from '../queryables/envrionmentQuery';
import { TfBackendConfigKeys, defaultTfBackendConfig } from '../tfBackendConfig';

export default class Deploy extends Command {
  static description = 'Deploy AWS Semantic Search'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    // flag with a value (-n, --name=VALUE)
    name: Flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: Flags.boolean({char: 'f'}),
  }

  static args = {
    file: Args.string({description: 'file to read'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Deploy);

    const env = complete(await EnvironmentQuery.query());
    console.dir(env);


    const currentTfBackendConfig = env.existingInfrastructureTfBackendConfig? new Map([...defaultTfBackendConfig, ...env.existingInfrastructureTfBackendConfig]): defaultTfBackendConfig;
    const currentConfig = {...defaultConfig, ...{tfBackendConfig: currentTfBackendConfig}}
    displayDefaults(currentConfig);
    const useDefaultConfig = await promptDefaultConfig();
    const config = useDefaultConfig ? currentConfig : await promptConfig(currentConfig);
    console.dir(config);

    Deployer.deploy(config, env);
   
    
    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/malterei/Downloads/semantic-search-aws-docs/semantic-search-cli/src/commands/deploy.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}


const displayDefaults = async (config: SemanticSearchConfig) => {
  printer.warn("Note: This will deploy the AWS Semantic Search project from your current directory");
  printer.blankLine();
  printer.success("The deployment will use the following configuration:");
  printer.blankLine();
  printer.info('Deployment information');
  printer.info(`| Region: ${config.tfBackendConfig.get(TfBackendConfigKeys.region)}`);
  printer.info(`| Terraform back-end S3 bucket name: ${config.tfBackendConfig.get(TfBackendConfigKeys.bucket)}`);
  printer.info(`| Terraform back-end DynamoDB sync table name: ${config.tfBackendConfig.get(TfBackendConfigKeys.dynamodb_table)}`);
  printer.info('Ingestion configuration');
  printer.info(`| AWS documentation data source: ${config.ingestionSource}`);
  printer.blankLine();
}

const promptDefaultConfig = async () => {
  return prompter.yesOrNo("Deploy AWS Semantic Search with the above configuration?")
}

const promptConfig = async (currentConfig: SemanticSearchConfig): Promise<SemanticSearchConfig> => {

  const region = await prompter.pick("Select the AWS region that you want to deploy the AWS Semantic Search solution to.",["us-east-1", "eu-central-1"]);
  const tfStateS3BucketName = await prompter.input("Enter the name of the S3 bucket that will be used to store the Terraform state.", {
    initial: currentConfig.tfBackendConfig.get(TfBackendConfigKeys.bucket)
  });
  const tfStateSyncTableName = await prompter.input("Enter the name of the DynamoDB table that will be used to store the Terraform sync data.", {
    initial: currentConfig.tfBackendConfig.get(TfBackendConfigKeys.dynamodb_table)
  });
  const ingestionSource = await prompter.pick("Which AWS documentation do you want to ingest as an example data source?", ["amazon-ec2-user-guide", "full", "none"])

  return {
    tfBackendConfig: new Map([[TfBackendConfigKeys.region, region],[TfBackendConfigKeys.bucket, tfStateS3BucketName],[TfBackendConfigKeys.dynamodb_table, tfStateSyncTableName]]),
    ingestionSource: ingestionSource
  }
}
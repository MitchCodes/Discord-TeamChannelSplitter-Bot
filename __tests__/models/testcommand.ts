import { ICommand, ICommandFactory, ICommandResult, CommandResult, CommandResultStatus } from '../../src/models/Command';
import { Message, TextChannel, GuildMember } from 'discord.js';
import { ICommandPermissions, CommandPermissionRequirementSettings, CommandPermissionFeedbackType, 
    CommandPermissionType, CommandPermissionRequirement } from '../../src/models/CommandPermission';
import { IDiscordBot } from '../../src/models/DiscordBot';
import { DH_NOT_SUITABLE_GENERATOR } from 'constants';
import { TestBot } from '../bots/testbot';

export class TestCommand implements ICommand, ICommandFactory, ICommandPermissions {
    public commandName: string = 'Ping Pong';
    public commandDescription: string = 'Simple ping pong test';
    public commandMatchText: string = 'ping';
    public permissionRequirements: CommandPermissionRequirementSettings;
    public permissionFailReplyType: CommandPermissionFeedbackType;
    public testIsSet: boolean = false;

    public constructor() {
        let anyTextChannelReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        anyTextChannelReq.permissionType = CommandPermissionType.anytextchannel;

        let textChannelReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        textChannelReq.permissionType = CommandPermissionType.textchannel;
        textChannelReq.identifier = 'botcommands';

        let customReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        customReq.permissionType = CommandPermissionType.custom;
        customReq.customCallback = ((msg: Message, guildMember: GuildMember, requirement: CommandPermissionRequirement): Promise<boolean> => {
            return Promise.resolve<boolean>(true);
        });

        let customFailReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        customFailReq.permissionType = CommandPermissionType.custom;
        customFailReq.customCallback = ((msg: Message, guildMember: GuildMember, requirement: CommandPermissionRequirement): Promise<boolean> => {
            return Promise.resolve<boolean>(false);
        });

        let permissionReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        permissionReq.permissionType = CommandPermissionType.permission;
        permissionReq.identifier = 'ADMINISTRATOR';


        let anyBizarreReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        anyBizarreReq.permissionType = CommandPermissionType.textchannel;
        anyBizarreReq.identifier = 'kjahsdkjshdskjhd';

        let anyTextForAnyReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        anyTextForAnyReq.permissionType = CommandPermissionType.anytextchannel;


        let anyByTypeAnyTextChannelReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        anyByTypeAnyTextChannelReq.permissionType = CommandPermissionType.anytextchannel;

        let anyByTypeTextChannelReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        anyByTypeTextChannelReq.permissionType = CommandPermissionType.textchannel;
        anyByTypeTextChannelReq.identifier = 'botcommands';

        let anyByTypeBizarreReq: CommandPermissionRequirement = new CommandPermissionRequirement();
        anyByTypeBizarreReq.permissionType = CommandPermissionType.textchannel;
        anyByTypeBizarreReq.identifier = 'asdsdsd';


        this.permissionRequirements = new CommandPermissionRequirementSettings();
        this.permissionRequirements.allRequirements.push(anyTextChannelReq);
        this.permissionRequirements.allRequirements.push(textChannelReq);
        this.permissionRequirements.allRequirements.push(customReq);
        this.permissionRequirements.allRequirements.push(permissionReq);

        this.permissionRequirements.anyRequirements.push(anyBizarreReq);
        this.permissionRequirements.anyRequirements.push(anyTextForAnyReq);

        this.permissionRequirements.anyRequirementsByType.push(anyByTypeAnyTextChannelReq);
        this.permissionRequirements.anyRequirementsByType.push(anyByTypeTextChannelReq);
        this.permissionRequirements.anyRequirementsByType.push(customReq);
        this.permissionRequirements.anyRequirementsByType.push(customFailReq);

        this.permissionFailReplyType = CommandPermissionFeedbackType.direct;

    }

    public getPermissionFailReplyText(msg: Message): string {
        return 'You do not have permission to ping pong.';
    }

    public makeCommand(): ICommand {
        return new TestCommand();
    }
    
    public execute(bot: IDiscordBot, msg: Message): Promise<ICommandResult> {
        return new Promise<ICommandResult>((resolve : (val: ICommandResult) => void) => {
            let result: CommandResult = new CommandResult();

            if (msg.content === '!ping') {
                this.testIsSet = true;
                msg.channel.send('pong');
            }

            let botCasted: TestBot = <TestBot>bot;
            botCasted.pingPongTimesCalled += 1;

            result.status = CommandResultStatus.success;
            resolve(result);
        });
    }

    public setupPermissions(bot: IDiscordBot, msg: Message) {

    }
}

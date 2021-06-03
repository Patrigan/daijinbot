const fs = require('fs');

module.exports = {
    name: 'reactionrole',
    description: "Sets up a reaction role message!",
    async execute(message, args, Discord, client) {
        const channel = '850092871600046110';
        const yellowTeamRole = message.guild.roles.cache.find(role => role.name === "Test1");
        const blueTeamRole = message.guild.roles.cache.find(role => role.name === "Test2");
        let rawdata = fs.readFileSync('../data/student.json');
        let roles = JSON.parse(rawdata);
        let emoteMap = new Map();

        let embed = new Discord.MessageEmbed()
            .setColor('#e42643')
            .setTitle('Choose a team to play on!');

        let description = 'Choosing a team will allow you to interact with your teammates!\n\n';
        roles.forEach(role =>
            {
                description = description.concat(role.emote + " - " + role.description);
            }
        )

        let messageEmbed = await message.channel.send(embed);
        roles.forEach(role =>
            {
                messageEmbed.react(role.emote);
                emoteMap[role.emote] = message.guild.roles.cache.find(discordRole => discordRole.name === role.role);
            }
        )

        client.on('messageReactionAdd', async (reaction, user) => {
            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;

            if (reaction.message.channel.id == channel) {
                if(reaction.emoji.name in emoteMap){
                    await reaction.message.guild.members.cache.get(user.id).roles.add(emoteMap[reaction.emoji.name]);
                }
            } else {
                return;
            }

        });

        client.on('messageReactionRemove', async (reaction, user) => {

            if (reaction.message.partial) await reaction.message.fetch();
            if (reaction.partial) await reaction.fetch();
            if (user.bot) return;
            if (!reaction.message.guild) return;


            if (reaction.message.channel.id == channel) {
                if(reaction.emoji.name in emoteMap){
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(emoteMap[reaction.emoji.name]);
                }
            } else {
                return;
            }
        });
    }

}
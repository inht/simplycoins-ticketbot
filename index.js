const { timeStamp, time, log } = require("console");
const Discord = require("discord.js");
const { get } = require("http");
const bot = new Discord.Client({disableEveryone: true, fetchAllMembers: true, presence: true});

const { join, dirname } = require("path");

const configFile = require("./config.json");
const otherFile = require("./package.json");

const JSONEditer = require("edit-json-file");
const { isNull, isNullOrUndefined, isDeepStrictEqual } = require("util");
const letFile = JSONEditer("./config.json", {
    autosave: true
});

var botname = configFile.name;
var token = configFile.token;
var botid = configFile.botid;
var p = configFile.prefix;
var ver = otherFile.version;
var author = otherFile.author;

process.on('unhandledRejection', error => {
 console.error('Unhandled promise rejection:', error);
 return;
});

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US').format(date)
};

bot.on("ready", async ()=> {
    bot.user.setActivity("payments.", {type: "STREAMING", url: ""});
    console.log(botname + " is now online running on " + ver + ".");
    console.log("Invite Link: https://discord.com/oauth2/authorize?client_id=" + botid + "&scope=bot&permissions=8");
});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);
    let color = "#ff5649";
    // Emojis
    var phoneEmoji = bot.emojis.cache.find(e => e.id === "929608336838651934");
    var userEmoji = bot.emojis.cache.find(e => e.id === "929610210933366804");
    var useridEmoji = bot.emojis.cache.find(e => e.id === "929616325293252608");
    var statusEmoji = bot.emojis.cache.find(e => e.id === "929616300794331176");
    var joinedEmoji = bot.emojis.cache.find(e => e.id === "929616334466203658");
    var createdEmoji = bot.emojis.cache.find(e => e.id === "929616318322339901");
    var discrimEmoji = bot.emojis.cache.find(e => e.id === "929616310189576254");
  
    if(cmd === p + "info") {
      let ticketGuild = bot.guilds.cache.get("842981177529991190");
      let fetchTicketCategory = ticketGuild.channels.cache.find(c => c.name === "Tickets" && c.type === "category");
      let ticketCount = fetchTicketCategory.children.size;
  
      let fetchCloseTicketCategory = ticketGuild.channels.cache.find(c => c.name === "Closed Tickets" && c.type === "category");
      let closedticketCount = fetchCloseTicketCategory.children.size;

        let embed = new Discord.MessageEmbed()
        .setAuthor("About Simply Coins")
        .setDescription("Simply Coins is custom **discord.js** bot created specially for Simply Coins. Each feature programmed is to insure that everything runs smooth.")
        .addField("Prefix", `\`\`\`${p}\`\`\``, true)
        .addField("Bot ID", `\`\`\`${botid}\`\`\``, true)
        .setImage("https://iili.io/Y6aena.md.png")
        .addField("Total Guilds", `\`\`\`${bot.guilds.cache.size}\`\`\``, true)
        .addField("Total Members", `\`\`\`${bot.users.cache.size}\`\`\``, true)
         .addField("Open Tickets", `\`\`\`${ticketCount}\`\`\``, true)
        .addField("Closed Tickets", `\`\`\`${closedticketCount}\`\`\``, true)
        .addField("Version", `\`\`\`${ver}\`\`\``, true)
        .addField("Discord Library", "\`\`\`discord.js@12.4.1\`\`\`", true)
        .setColor("#ff5649")
        .setTimestamp()
        .setFooter("Made with ♥ by " + author, "https://cdn.discordapp.com/emojis/661665923043688469.gif");
    message.channel.send(embed);
    }

    if(cmd === p + "userinfo") {
      let mentionedUser = message.mentions.users.first() || bot.users.cache.find(u => u.username === args.join(" "));

      const status = {
        online: "Online",
        offline: "Offline",
        idle: "Idling",
        dnd: "Do Not Disturb"
      }

      const deviceType = {
        web: "Web",
        desktop: "Desktop",
        mobile: "Mobile"
      }

      if(!mentionedUser) {

      let deviceTypeAuthor = message.author.presence.clientStatus;
      let deviceTypeArray = Object.getOwnPropertyNames(deviceTypeAuthor);
      let deviceTypeValue = deviceTypeArray[0];
      
       let embed = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor("Simply Coins User Information")
        .setDescription("Showing information for <@" + message.author.id + ">")
        .setThumbnail(message.author.avatarURL())
        .addField(`${userEmoji} Username`, `\`\`\`${message.author.username}\`\`\``, true)
        .addField(`${discrimEmoji} Discriminator`, `\`\`\`#${message.author.discriminator}\`\`\``, true)
        .addField(`${useridEmoji} ID`, `\`\`\`${message.author.id}\`\`\``, true)
        .addField(`${statusEmoji} Status`, `\`\`\`${status[message.author.presence.status]}\`\`\``, true)
        .addField(`${phoneEmoji} Device`, `\`\`\`${deviceType[deviceTypeValue]}\`\`\``, true)
        .addField(`${createdEmoji} Joined Discord`, `\`\`\`${formatTime(message.author.createdAt)}\`\`\``, true)
        .addField(`${joinedEmoji} Joined Server`, `\`\`\`${formatTime(message.author.joinedAt)}\`\`\``, true);
        message.channel.send(embed);
      }  else {
        let embed = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor("Simply Coins User Information")
        .setDescription("Showing information for <@" + mentionedUser.id + ">")
        .setThumbnail(mentionedUser.avatarURL())
        .addField(`${userEmoji} Username`, `\`\`\`${mentionedUser.username}\`\`\``, true)
        .addField(`${discrimEmoji} Discriminator`, `\`\`\`#${mentionedUser.discriminator}\`\`\``, true)
        .addField(`${useridEmoji} ID`, `\`\`\`${mentionedUser.id}\`\`\``, true)
        .addField(`${statusEmoji} Status`, `\`\`\`${status[mentionedUser.presence.status]}\`\`\``, true)
        .addField(`${createdEmoji} Joined Discord`, `\`\`\`${formatTime(mentionedUser.createdAt)}\`\`\``, true)
        .addField(`${joinedEmoji} Joined Server`, `\`\`\`${formatTime(mentionedUser.joinedAt)}\`\`\``, true);
        message.channel.send(embed);  
      } 

      // presence.clientStatus
      //
    }

    if(cmd === p + "setprefix") {
      if(message.member.hasPermission('ADMINISTRATOR')) {
        let newPrefix = args[0];
        let currentPrefix = p;
        if(!newPrefix) {
          let embed = new Discord.MessageEmbed()
          .setAuthor("Error")
          .setColor("#ff5649")
          .setDescription("❌ You need to include the new prefix you want.");
          message.channel.send(embed);
        } else if(newPrefix === currentPrefix) {
          let embed = new Discord.MessageEmbed()
          .setAuthor("Error")
          .setColor("#ff5649")
          .setDescription("❌ The prefix you provided is the same as the current one.");
          message.channel.send(embed);
        } else {
          letFile.set("prefix", newPrefix);
          letFile.save();
          let embed = new Discord.MessageEmbed()
          .setAuthor("Configuration")
          .setColor("#ff5649")
          .setDescription("The prefix has been set to `" + newPrefix + "`");
          message.channel.send(embed);
        }

      } else {
        let embed = new Discord.MessageEmbed()
        .setAuthor("Insufficient Permissions")
        .setColor("#ff5649")
        .setDescription("❌ You need `Administrator` to do that.");
        message.channel.send(embed);
      }
    }


    if(cmd === p + "t") {
      message.delete();

      if(args[0] === "reply") {
        if(message.member.hasPermission("ADMINISTRATOR")) {
          let botmessage = args.join(" ").slice(args[0].length);
          let embed = new Discord.MessageEmbed()
          .setAuthor("Simply Coins Support")
          .setColor("#ff5649")
          .setDescription(botmessage);
          message.channel.send(embed);
        } else {
          let embed = new Discord.MessageEmbed()
          .setAuthor("Insufficient Permissions")
          .setColor("#ff5649")
          .setDescription("❌ You need `Administrator` to do that.");
          message.channel.send(embed);
        }
      }

      if(args[0] === "new") {
        let member = message.author;
        let getDate = new Date();
        let timestamp = getDate.toLocaleString();
        let guilds = message.guild;

        let embed1 = new Discord.MessageEmbed()
        .setAuthor("Welcome to Simply Coins")
        .setColor("#ff5649")
        .setDescription("Hey <@" + message.author.id + ">! Thank you for creating a ticket, because we do enjoy helping people. We first have to know the reason of this ticket.");
        let embedChoose =  new Discord.MessageEmbed()
        .setAuthor("State ticket creation reason")
        .setColor("#ff5649")
        .setDescription("Are you purchasing or have questions?");
        const ticketChannel = await guilds.channels.create('ticket-' + member.username, {
          type: "text",
          topic: `| 🎫 **Ticket**: Opened by <@${member.id}> at ${timestamp}`
        }).then(c => {
          c.updateOverwrite(c.guild.roles.everyone, {VIEW_CHANNEL: false})

          c.updateOverwrite(message.author.id, {VIEW_CHANNEL: true, SEND_MESSAGES: true, MENTION_EVERYONE: false});
          let ticketGuild = message.guild;

          let fetchTicketCategory = ticketGuild.channels.cache.find(c => c.name === "Tickets" && c.type === "category");

          c.setParent(fetchTicketCategory.id);
          c.send(embed1) && c.send(embedChoose);
        });
      }
      if(args[0] === "close") {
        if(message.member.hasPermission("ADMINISTRATOR")) {
          if(args[1] === "perm") {
            message.channel.delete();
          } else {
            let currentChannel =  message.channel.name.includes("ticket");
            if(!currentChannel) {
              let embed = new Discord.MessageEmbed()
              .setAuthor("Wrong Channel")
              .setColor("#ff5649")
              .setDescription("❌ You can only use this command in tickets.");
              message.channel.send(embed);
            } else {
              let member = message.author;
              let getDate = new Date();
              let timestamp = getDate.toLocaleString();
              let currentTopic = message.channel.topic;
              let username = message.channel.name.slice(7);
              let ticketGuild = message.guild;
              let fetchClosedTicketCategory = ticketGuild.channels.cache.find(c => c.name === "Closed Tickets" && c.type === "category");
              message.channel.setParent(fetchClosedTicketCategory.id);
              message.channel.setTopic(`${currentTopic}\n| 🎫 **Ticket**: Closed by <@${member.id}> at ${timestamp}`).then(message.channel.setName("completed-" + username));
              let embed = new Discord.MessageEmbed()
              .setAuthor("Ticket Closed")
              .setColor("#ff5649");
              message.channel.send(embed);
            }
          }
        } else {
          let embed = new Discord.MessageEmbed()
          .setAuthor("Insufficient Permissions")
          .setColor("#ff5649")
          .setDescription("❌ You need `Administrator` to do that.");
          message.channel.send(embed);
        }
      }
    }
    
    if(cmd === p + "transaction") {
      let transactionID = args[0];
      if(!transactionID) {
        let embed = new Discord.MessageEmbed()
        .setAuthor("Error")
        .setColor("#ff5649")
        .setDescription("❌ Usage: `" + p + "transaction <id>`" );
        message.channel.send(embed);
      } else {
        let embed = new Discord.MessageEmbed()
        .setAuthor("Confirming Transaction")
        .setColor("#ff5649")
        .setDescription("I am confirming the transaction...");
        let embed2 = new Discord.MessageEmbed()
        .setAuthor("Confirmed Transaction")
        .setColor("#ff5649")
        .setDescription("Transaction: `" + transactionID + "`");
        message.channel.send(embed).then((m) => setTimeout(function(){m.edit(embed2)}, 5000));
      }
    }

    const adminid = "813643819534254130";
    
    // Developer Commands
    if(cmd === p + "get"){
      if(message.author.id === adminid) {
        

        if(args[0] === "allguilds") {
          let guilds = bot.guilds.cache.forEach((guild) => {

            let rolemap = guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r.name).join(", ");
            let embed = new Discord.MessageEmbed()
            .setAuthor("Guild - " + guild.name)
            .setTitle("Currently has " + guild.members.cache.size + " members.")
            .setThumbnail(guild.iconURL())
            .setColor("#ff5649")
            .addField("Owner", `\`\`\`${guild.owner.displayName}\`\`\``, true)
            .addField("Region", `\`\`\`${guild.region}\`\`\``, true)
            .addField("Channels", `\`\`\`${guild.channels.cache.size}\`\`\``, true)
            .addField("Roles", `\`\`\`${rolemap}\`\`\``);

            message.channel.send(embed);
          });
        }

      } else {
        let embed = new Discord.MessageEmbed()
        .setAuthor("Unauthorized User")
        .setColor("#ff5649")
        .setDescription("❌ You need to the `Bot Administrator` to do that.");
        message.channel.send(embed);
      }
    }

    if(cmd === p + "avatar") {
      let mentionedUser = message.mentions.users.first() || bot.users.cache.find(u => u.username === args.join(" "));
      if(!mentionedUser) {
        let embed = new Discord.MessageEmbed()
        .setAuthor(message.author.username + "'s Avatar")
        .setDescription("[Avatar Download](" + message.author.avatarURL({format: "jpeg"}) + ")")
        .setColor("#ff5649")
        .setImage(message.author.avatarURL({format: "jpeg"}))
        message.channel.send(embed);
      } else {
        let embed = new Discord.MessageEmbed()
        .setAuthor(mentionedUser.username + "'s Avatar")
        .setDescription("[Avatar Download](" + mentionedUser.avatarURL({format: "jpeg"}) + ")")
        .setColor("#ff5649")
        .setImage(mentionedUser.avatarURL({format: "jpeg"}))
        message.channel.send(embed);
      }
    }

    if(cmd === p + "ping") {
      let latency = Date.now() - message.createdTimestamp;
      let embed = new Discord.MessageEmbed()
      .setAuthor("Pinging...")
      .setDescription(`Please wait while we get the latency and API.`)
      .setColor("#ff5649");
      let newEmbed = new Discord.MessageEmbed()
      .setAuthor("Results")
      .setDescription(`Latency - ${latency}ms\nAPI - ${bot.ws.ping}ms`)
      .setColor("#ff5649");
      message.channel.send(embed).then((m) => {setTimeout(function(){
        m.edit(newEmbed);
      }), latency});
    }
  });

bot.login(token);
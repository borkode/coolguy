const Discord = require('discord.js'); 
const bot = new Discord.Client();
var channels = ['486690504877277194','486690518537994245','486690532601364502']
var channelsto = ['0','0','0']
var origGame = "?help | ?talk"
var botState;
console.log("Starting Bot Client...")
bot.on('ready', () => {
    console.log("Bot is ready to be used.")
bot.user.setActivity(origGame);
botState = "off"
});

function getChannel(id){
    return channels.indexOf(id)
}

function getToChannel(id){
    return channelsto.indexOf(id)
}

function sendAttachmentsIfAny(attachmentsarray,mc){
    if(attachmentsarray.length!=undefined){
      //mc.send("",{file:attachmentsarray.MessageAttachment.url})
      mc.send("They also attached a file.\nFiles are not supported yet.")
      mc.send(JSON.parse(attachmentsarray).MessageAttachment.url)
    }
}

function sendEmbed(author,messagecontent,mc){
    if(messagecontent==""){var ctnt="This message is blank or contained a file."}else{var ctnt=messagecontent}
    mc.send({embed: {
        color: 5373789,
        author: {
          name: "Message from "+author.username,
          icon_url: author.avatarURL
        },
        timestamp: new Date(),
        description: ctnt+"\n",
        footer: {
          icon_url: bot.user.avatarURL,
          text: "powered by cool guy"
        }
      }
    });
}

bot.on('message', message => {
    if(message.author.id!=486254127135981569){
    // User commands
    if(message.content=="?talk"){
        message.channel.send("Okay, we're connecting you to a person right now.")
        bot.channels.get('486607994063421445').send("User "+message.author.username+" would like to chat.\n`?connect "+message.channel.id+"`")
    }
    
    // Connection command
    if(getChannel(message.channel.id)!=-1){
        if(message.content.startsWith('?connect')){
            var channel = message.content.substr(9,message.content.length)
            channelsto[getChannel(message.channel.id)]=channel.toString()
            bot.channels.get(channel).send("You've been connected. Say hi!")
        }
    }

    //Messaging
if(!message.content.startsWith('?connect') && !message.content.startsWith("?disconnect")){
    // Client to Us
    if(getToChannel(message.channel.id)!=-1){
        sendEmbed(message.author,message.content,bot.channels.get(channels[getToChannel(message.channel.id)]))
        sendAttachmentsIfAny(message.attachments,message.channel)
        
    }
    // Us to Client
    if(getChannel(message.channel.id)!=-1){
        sendEmbed(message.author,message.content,bot.channels.get(channelsto[getChannel(message.channel.id)]))
        sendAttachmentsIfAny(message.attachments,message.channel)
    }}
    //Disconnection command
        if(message.content=='?disconnect'){
    if(getChannel(message.channel.id)!=-1){
        bot.channels.get(channels[getChannel(message.channel.id)]).send("The other person has disconnected. If you wish to talk again, use `?talk`.")
        bot.channels.get(channelsto[getChannel(message.channel.id)]).send("You have disconnected from the other person. If you wish to talk again, use `?talk`.")
        channelsto[getChannel(message.channel.id)]='0'
    }
    if(getToChannel(message.channel.id)!=-1){
        bot.channels.get(channels[getToChannel(message.channel.id)]).send("The other person has disconnected. If you wish to talk again, use `?talk`.")
        bot.channels.get(channelsto[getToChannel(message.channel.id)]).send("You have disconnected from the other person. If you wish to talk again, use `?talk`.")
        channelsto[getToChannel(message.channel.id)]='0'
    }
    }
    //Help command
    if(message.content=="?help"){
        message.channel.send({embed: {
            color: 5373789,
            author: {
              name: "Help Center",
              icon_url: bot.user.avatarURL
            },
            title: "?help",
            description: "Brings up this menu",
            fields: [{
                name: "?talk",
                value: "Enlists your server in the queue to talk to a random server"
              },
              {
                name: "?connect {Server ID}",
                value: "Connects you to a specific server using the server ID"
              },
              {
                name: "?disconnect",
                value: "Disconnects you from any connection (if any)"
              }
            ],
            footer: {
              icon_url: message.author.avatarURL,
              text: "Requested by "+message.author.username
            }
          }
        });
    }
}
});

// Don't forget to use your bot.login(); here.

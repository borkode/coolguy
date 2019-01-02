const Discord = require('discord.js'); 
const bot = new Discord.Client();
var adminch = ['486690504877277194','486690518537994245','486690532601364502']
var ch1 = []
var ch2 = []
var queue = ""
var origGame = "New features being tested!"
var botState;
console.log("Starting Bot Client...")
bot.on('ready', () => {
console.log("Bot is ready to be used.")
bot.user.setActivity(origGame);
});

function getChannel(id){
    return ch1.indexOf(id)
}

function getToChannel(id){
    return ch2.indexOf(id)
}

function sendEmbed(author,msg,mc){
    var ctnt = msg.content
    var file = []
        msg.attachments.forEach(attachment => {
            const url = attachment.url;
            file.push(url)
          });
          if(msg.content!=""){
    mc.send({embed: {
        color: 5373789,
        author: {
          name: "Message from "+author.username,
          icon_url: author.avatarURL
        },
        timestamp: new Date(),
        description: ctnt,
        footer: {
          icon_url: bot.user.avatarURL,
          text: "powered by cool guy"
        }
      }
    });
}
if(file.length>0){
    for(var i = 0;i<file.length;i++){
        mc.send({files:[file[i]]});
}}
}

function sendAlert(alert,channel){
    channel.send({embed: {
        color: 5373789,
        author:{
            name: "Alert",
            icon_url: bot.user.avatarURL
        },
        timestamp: new Date(),
        description:alert,
        footer: {
            icon_url: bot.user.avatarURL,
            text: "powered by cool guy"
        }
    }})
}

bot.on("guildCreate", (guild) => {
    let channelID;
    let channels = guild.channels;
    channelLoop:
    for (let c of channels) {
        let channelType = c[1].type;
        if (channelType === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }

    let channel = bot.channels.get(guild.systemChannelID || channelID);
    setTimeout(function(){
    channel.send({embed: {
        color: 5373789,
        author: {
          name: "cool guy",
          icon_url: bot.user.avatarURL
        },
        title: "Hi! I'm cool guy!",
        description: "I am a cross-server interaction bot. Use the command `?talk` to get started! You can also use `?help` to see my other commands.",
        footer: {
          icon_url: bot.user.avatarURL,
          text: "Thanks for adding me to your server!"
        }
      }
    });
},10);
});

bot.on('message', message => {
    if(!message.author.bot){
    // User commands
    if(message.content=="?talk"){
        if(queue!=message.channel.id.toString()){
        sendAlert("Your server is now in the queue.",message.channel);
        if(queue==""){
        queue=message.channel.id.toString();
        }else{
        sendAlert("Connection established! Say hello!",message.channel);
        sendAlert("Connection established! Say hello!",bot.channels.get(queue))
        ch1.push(queue)
        ch2.push(message.channel.id.toString())
        queue=""
        }
    }else{
        sendAlert("Your server is already on the queue! You can use the command `?unqueue` to take it off the queue.",message.channel)
        }
    }

    if(message.content=="?unqueue"){
        if(queue==message.channel.id){
            queue=""
            sendAlert("Okay, your bot was removed from the queue.",message.channel)
        }else{
            sendAlert("Your server is not on the queue. You can use the command `?talk` to enlist in it.",message.channel)
        }
    }

    //Messaging
if(!message.content.startsWith('?help') && !message.content.startsWith("?disconnect") && !message.content.startsWith('?bugreport') && !message.content.startsWith("?talk")){
    // ch2 to ch1
    if(getToChannel(message.channel.id)!=-1){
        sendEmbed(message.author,message,bot.channels.get(ch1[getToChannel(message.channel.id)]))
        
    }
    // ch1 to ch2
    if(getChannel(message.channel.id)!=-1){
        sendEmbed(message.author,message,bot.channels.get(ch2[getChannel(message.channel.id)]))
    }}
    //Disconnection command
        if(message.content=='?disconnect'){
    if(getChannel(message.channel.id)!=-1){
        sendAlert("The other person has disconnected. If you wish to talk again, use `?talk`.",bot.channels.get(ch2[getChannel(message.channel.id)]))
        sendAlert("You have disconnected from the other person. If you wish to talk again, use `?talk`.",bot.channels.get(ch1[getChannel(message.channel.id)]))
        ch1[getChannel(message.channel.id)]='0'
        ch2[getChannel(message.channel.id)]='0'
    }
    if(getToChannel(message.channel.id)!=-1){
        sendAlert("The other person has disconnected. If you wish to talk again, use `?talk`.",bot.channels.get(ch1[getToChannel(message.channel.id)]))
        sendAlert("You have disconnected from the other person. If you wish to talk again, use `?talk`.",bot.channels.get(ch2[getToChannel(message.channel.id)]))
        ch1[getToChannel(message.channel.id)]='0'
        ch2[getToChannel(message.channel.id)]='0'
    }
    }
    // Bug report command
    if(message.content.startsWith("?bugreport ")){
        sendEmbed(message.author,message.substring(10,message.content.length)+"\n\n**"+message.author.id+"**",bot.channels.get('529541510895632394'));
        sendAlert("Thank you for the bug report!",message.channel);
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
                value: "Enlists your server in the queue to talk to another random server"
              },
              {
                name: "?disconnect",
                value: "Removes your server from the connection (if any)"
              },
              {
                name: "?unqueue",
                value: "Unenlists you from the queue, if your server is on there."
              },
              {
                name: "?bugreport {Bug/Explanation}",
                value: "Find a bug? Submit it! We can't find all the bugs ourselves!"
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

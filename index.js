const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = "NDgxMTU3NDgyODcwMzQxNjMy.Dl2P_A.5kLm2rwvf3Q-7iKY-EEh6vgK5YY";
const PREFIX = ".";

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function() {
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}

var fortunes = [
    "Yes",
    "No",
    "Maybe",
    "Fuck you",
    "Ah Hell Nah"
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function(){
    console.log("Ready");
});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;
    
    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0].toLocaleLowerCase()) {
         case "ping":
             message.channel.sendMessage("Pong!");
             break;
         case "info":
             message.channel.sendMessage("LxMJO Made Me By His Self!");
             break;
         case "8ball":
             if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);
             else message.channel.sendMessage ("Can't Read That");
             break;
         case "profile":
             var embed = new Discord.RichEmbed()
                 .addField("My Profile:", "A Real GCE Gamer!")
                 .addField("My Profile Picture:", "Yay Its Me!")
                 .setColor(0x00FFFF)
                 .setThumbnail(message.author.avatarURL,true)
             message.channel.sendEmbed(embed);
             break;
         case "play":
             if (!args[1]) {
                 message.channel.sendMessage("Please Provide A Link")
                 return;
             }

             if (!message.member.voiceChannel) {
                 message.channel.sendMessage("You Must Be In A Voice Channel!")
                 return;
             }

             if (!servers[message.guild.id]) servers[message.guild.id] = {
                 queue: []
             };



             var server = servers[message.guild.id];

             server.queue.push(args[1]);

             if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                 play(connection, message);
             });
             break;
         case "skip":
             var server = servers[message.guild.id];

             if (server.dispatcher) server.dispatcher.end();
             break;
         case "stop":
             var server = servers[message.guild.id];

             if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
             break;
         default:
             message.channel.sendMessage("Invalid command");
    }
});

bot.login(TOKEN);

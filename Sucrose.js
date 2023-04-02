//BOT SACAROSA

const Discord = require("discord.js");
const client = new Discord.Client();
const { Client, MessageEmbed } = require('discord.js');
const Canvacord = require("canvacord");
const db = require('quick.db');

//ESTADO DE PERFIL DE BOT
client.on("ready", () => {
  console.log("Rosetta lista");
  client.user.setPresence({activity: { name: 'libros de BioAlquimia🧪', type: 'WATCHING' }, status: 'idle'})
  });

// TIRAR EL DADO
client.on('message', message => {
    if (message.content === `¡dice`) {
        let valor = Math.floor(Math.random() * 6 + 1);
        client.channels.cache.get('826620399323709501').send(`⭐ Obtuviste un 🎲${valor}`)
    }
});

// SISTEMA DE NIVELES
client.on('message', async message => {
  const prefix = '¡';
  //Creo la Respuesta del XP
  xp(message)
  //Si MSM es ¡rank
  if(message.content.startsWith(`${prefix}rank`)) {
    if(message.author.bot) return;
      //Defino al usuario, nivel, avance
      var user = message.mentions.users.first() || message.author;
    var level = db.fetch(`guild_${message.guild.id}_level_${user.id}`) || 0;
    var currentXP = db.fetch(`guild_${message.guild.id}_xp_${user.id}`) || 0;
    var xpNeeded = level * 250 + 250
    //Creo me imagen con el progreso de XP
    const RankCard = new Canvacord.Rank()
      .setAvatar (user.displayAvatarURL ({format: "png", dynamic: true}))
      .setCurrentXP (db.fetch(`guild_${message.guild.id}_xp_${user.id}`) || 0)
      .setRequiredXP (xpNeeded)
      .setStatus (user.presence.status)
      .setLevel (db.fetch(`guild_${message.guild.id}_level_${user.id}`) || 0)
      .setRank (1, 'Rank', false)
      .setProgressBar ("#00F0F8FF", "COLOR")
      .setOverlay ("#00000000")
      .setUsername (user.username)
      .setDiscriminator (user.discriminator)
      .setBackground("IMAGE", "https://cdn.discordapp.com/attachments/735730825030795344/920861966636056606/es.png")
      RankCard.build()
      .then(data => {
        //Finalmente el mensaje será enviado al canal por ID
        const atta = new Discord.MessageAttachment(data, "rank.png")
        client.channels.cache.get('826620399323709501').send(atta)
		//826639988812677120-826620399323709501
		//      .setOverlay ("#00000000")
      })
    } 
  })

//Operacion matematica del XP
function xp(message) {
  const prefix = '¡';
  if (message.author.bot || message.author === client.user) return;
  //Defino mi formula para hallar el XP
  const randomNumber = Math.floor(Math.random() * 15) + 30;
  db.add(`guild_${message.guild.id}_xp_${message.author.id}`, randomNumber)
  db.add(`guild_${message.guild.id}_xptotal_${message.author.id}`, randomNumber)
  var user = message.mentions.users.first() || message.author;
  var level = db.get(`guild_${message.guild.id}_level_${message.author.id}`) || 1
  var xp = db.get(`guild_${message.guild.id}_xp_${message.author.id}`)
  var xpNeeded = level * 250;
/*
  if(xpNeeded < xp){
    //Si un Usuario sube de nivel se le notifica
    var newLevel = db.add(`guild_${message.guild.id}_level_${message.author.id}`, 1)
    db.subtract(`guild_${message.guild.id}_xp_${message.author.id}`, xpNeeded)
    client.channels.cache.get('826620399323709501').send(`🎉 Hola ${message.author} ✨ Gracias a tu experiencia lograste subir a tu siguiente 🎊 **NIVEL ${newLevel}** 🎊`)
  }
  */
}

  // MODERACION ANTI-BadWords
  client.on('message', async message => {
  if (message.author.bot || message.author === client.user) return;
  
  let BadWord = ['mierda', 'verga', 'cmtr', 'mrd', 'chupa', 'cabro', 'perra', 'zorra'];
  
  let foundInText = false;
  for (var i in BadWord) {
    if (message.content.toLowerCase().includes(BadWord[i].toLowerCase())) foundInText = true;
  }
  if (foundInText) {
	  message.delete();
	  let BW = new MessageEmbed()
      .setColor("#872fc6")
      .addField("Advertencia de Gravedad Baja", `¡Hey ${message.author} sé mas respetuoso aquí o con tus compañeros, esto es sólo una advertencia pero de cometer otro tendrá un **Warn**. Si cree que fue un error comuniquenos en #🔎soporte!`)
	message.channel.send(BW);

	let Verify = new MessageEmbed()
      .setColor("#872fc6")
			.setTitle("Verificación de Infracción")
      .setDescription(`Estimados Moderadores, alguien incumplió la 1° Regla lo cual usted debe revisar si es verdad o si se trata de un error, si es la primera vez déjelo pasar pero si es la segunda vez aplique un **Warn**. En caso que sea un error omita este Mensaje.`)
      .addField("Usuario Cuestionado", `${message.author}`)
			.addField("Mensaje Eliminado", `${message.content}`)
	client.channels.cache.get('826639988812677120').send(Verify);
	client.channels.cache.get('826639988812677120').send(`@everyone`)
	  .then(message => {
		  message.delete({ timeout: 5000 })
		  })
		.catch(console.error);
	  }
  })

  //ESTADO CUSTOM
  client.on('message', async message => {
	  if (message.author.bot) return;
    let prefix = "¡";

    if (!message.content.startsWith(prefix)) return;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let msg = message.content.toLowerCase();
    let cmd = args.shift().toLowerCase();
  
    message.flags = [];
    while (args[0] && args[0][0] === "--") {
      message.flags.push(args.shift().slice(1));
    }
	
    //MESSAGE EMBED REGLAS
  if(msg.startsWith(prefix+"rules")){
    message.delete()
    
    let Ejem = new MessageEmbed()
	.setColor('#872fc6')
	.setTitle('📌REGLAS DEL SERVIDOR')
	.setDescription('Reglamentos de la Discordia para tener una buena Comunidad, incumplirlas supone un **Warn** o **Ban** dada la situación.')
	.addField("1️⃣ Reglamento", "🤝 Sé respetuoso con los demás.")
	.addField("2️⃣ Reglamento", "🔇 Evite temas bélicos que implique discusiones innecesarias.")
	.addField("3️⃣ Reglamento", "🔞 Prohibido contenido y/o material NSFW.")
	.addField("4️⃣ Reglamento", "🔰 Use los canales adecuados, mas ayuda en **#🔎soporte**.")
	.addField("5️⃣ Reglamento", "📍 Evite todo tipo de Links, Webs y Redes Sociales, use **#🌐spam.**")
	.setThumbnail('https://cdn.discordapp.com/attachments/735730825030795344/826690705069834280/final.png')
	.setTimestamp()
	.setFooter('Nadim', 'https://cdn.discordapp.com/attachments/604403312829136907/826895935774392380/R.png');

	message.channel.send(Ejem);
  }

})
  
  //INSTANCIA DE MODERACION
client.on('message', async message => {
  
  if (message.author.bot) return;
  let prefix = "¡";
  if (!message.content.startsWith(prefix)) return;
  
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let msg = message.content.toLowerCase();
  let cmd = args.shift().toLowerCase();
  message.flags = [];
  
  while (args[0] && args[0][0] === "--") {
    message.flags.push(args.shift().slice(1));
  }
  
	//REVOCAR WARN
    if (msg.startsWith(prefix + "unwarn")) {
      message.delete()
      if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Usted no tiene los suficientes Permisos!");
      let Wuser = message.mentions.users.first();
      let member = message.guild.member(Wuser);
      
      if (!Wuser) return message.channel.send("Menciona antes a un usuario!");
      if (Wuser.id === message.author.id) return message.channel.send("No pudo expulsar");
      if (Wuser.id === client.user.id) return message.channel.send("No puedes expulsarme");

      let reason = args.slice(1).join(" ");
      if (!reason) return message.channel.send("Escriba una Razón")
    
      const db = require('quick.db')
      let data = db.get(`warn.${Wuser.id}`);
      db.delete(`warn.${Wuser.id}`)

      let UnwarnEmbed = new MessageEmbed()
        .setColor("#872fc6")
        .setTitle("Revocación de Infracción | UnWarn")
        .addField("✅ Usuario Absuelto", `${Wuser}`+', se ha eliminado 1 warn por '+`${message.author}`)
        .addField("Razón", reason)
        client.channels.cache.get('826620399323709501').send(UnwarnEmbed);
	  }
  
  //MODERACION WARN
  if (msg.startsWith(prefix + "warn")) {
    message.delete()
    if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Usted no tiene los suficientes Permisos!");
    let Wuser = message.mentions.users.first();
    let member = message.guild.member(Wuser);
      
    if (!Wuser) return message.channel.send("Menciona antes a un usuario!");
    if (Wuser.id === message.author.id) return message.channel.send("No pudo expulsar");
    if (Wuser.id === client.user.id) return message.channel.send("No puedes expulsarme");

    let reason = args.slice(1).join(" ");
    if (!reason) return message.channel.send("Escriba una Razón")

	  let avatar = member.user.displayAvatarURL({ size: 2048 });
	  
	  const db = require('quick.db')
    let data = db.get(`warn.${Wuser.id}`);
	  db.add(`warn.${Wuser.id}`, 1);
    
    let WarnEmbed = new MessageEmbed()
      .setColor("#872fc6")
      .setTitle("WARN de Usuario")
      .setThumbnail(avatar)
      .setColor("#872fc6")
      .addField("⛔ Usuario", `${Wuser}, tiene ${data} Warn(s)`)
      .addField("Moderador(a)", `${message.author}`)
      .addField("Razón del Warn", reason)
      .addField("Nota", 'Sirvase a leer las **Reglas** para evitar problemas.')
      client.channels.cache.get('826620399323709501').send(WarnEmbed);
    }		
     
	// CANTIDAD DE WARNS
	if (msg.startsWith(prefix + "nwarn")) {
    message.delete()
    if (!message.member.hasPermission("MANAGE_MESSAGES") || !message.member.hasPermission("SEND_MESSAGES")) return message.channel.send("Usted no tiene los suficientes Permisos!");
    let NWuser = message.mentions.users.first();
    let member = message.guild.member(NWuser);
    
    if (!NWuser) return message.channel.send("Menciona antes a un usuario!");
	  let avatar = member.user.displayAvatarURL({ size: 2048 });
	  
	  const db = require('quick.db')
    let data = db.get(`warn.${Wuser.id}`);
    
    let NWARN = new MessageEmbed()
      .setColor("#872fc6")
      .setTitle("Warns de Usuario")
      .setThumbnail(avatar)
      .setColor("#872fc6")
      .addField("Usuario", `${Wuser}`)
      .addField("Cantidad de Warn(s)", `${data}`)  
      client.channels.cache.get('826620399323709501').send(NWARN);
  }
  
  //MODERACION BAN
  if (msg.startsWith(prefix + "ban")) {
    message.delete()
    if (!message.member.hasPermission("BAN_MEMBERS") || !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Usted no tiene Permisos Adminitrativos");
    let user = message.mentions.users.first();
    let member = message.guild.member(user);
    
    if (!user) return message.channel.send("Mencione antes a un usuario");
    if (user.id === message.author.id) return message.channel.send("No se pudo banear al usuario");
    if (user.id === client.user.id) return message.channel.send("No puedes banearme");
    
    let reason = args.slice(1).join(" ");
    if (!reason) return message.channel.send("Escriba una Razón")
	  let avatar = member.user.displayAvatarURL({ size: 2048 });
    
    member.ban(reason).then(() => {
      let BanEmbed = new MessageEmbed()
        .setColor("#872fc6")
        .setTitle("BAN de Usuario")
        .setThumbnail(avatar)
        .addField("🔒 User Banned", `${user}`)
        .addField("Autor de Moderación", `${message.author}`)
        .addField("Razón de su Prohibición", reason)
        .addField("Nota Adicional", 'Ban de por Vida')          
        client.channels.cache.get('826620399323709501').send(BanEmbed);
      }).catch(err => {
        message.reply("No se pudo banear al usuario, rol de admin");
      }
    )
  }
})
  
//TOKEN DE BOT
client.login("token");
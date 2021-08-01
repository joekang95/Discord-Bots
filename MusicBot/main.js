const discord = require( 'discord.js' );
const fs = require( 'fs' );

const client = new discord.Client();
client.commands = new discord.Collection();

const { prefix, token, commandchannel } = require( './config/config.json');

const commandfiles = fs.readdirSync( './commands/' ).filter( file => file.endsWith('.js') );
for ( const file of commandfiles ) 
{
    const command = require( `./commands/${file}`) ;
    client.commands.set( command.name, command );
}

client.once( 'ready', async () =>
{
    console.log( 'lalala online' );
    await client.user.setActivity( 'D4DJ' );
} )

client.on( 'message', message => 
{
    if ( !message.content.startsWith( prefix ) || message.author.bot ) 
    {
        return;
    }

    if( message.channel.id != commandchannel )
    {
        return;
    }

    const args = message.content.slice( prefix.length ).split( / +/ );
    const command = args.shift().toLowerCase();

    if ( client.commands.get( command ) ) {
        client.commands.get( command ).execute( message, args );
    }
    else{
        const embed = new discord.MessageEmbed()
        .setColor( '#0099ff' )
        .setTitle( 'Usage' )
        .addFields
        (
            { name: 'Play', value: '!music play [ youtube link ]\n!music play [ keyword ]', inline: true },
            { name: 'Skip', value: '!music skip', inline: true },
            { name: 'List', value: '!music list', inline: true }
        );

        return message.channel.send( embed );
    }
});


client.login( token );

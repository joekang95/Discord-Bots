const discord = require( 'discord.js' );
const fs = require( 'fs' );

const client = new discord.Client();
client.commands = new discord.Collection();

const { prefix, token } = require( './config/config.json');

const commandfiles = fs.readdirSync( './commands/' ).filter( file => file.endsWith('.js') );
for ( const file of commandfiles ) 
{
    const command = require( `./commands/${file}`) ;
    client.commands.set( command.name, command );
}

client.once( 'ready', () =>
{
} )

client.on( 'message', message => 
{
    if ( !message.content.startsWith( prefix ) || message.author.bot ) 
    {
        return;
    }

    const args = message.content.slice( prefix.length ).split( / +/ );
    const command = args.shift().toLowerCase();

    if ( client.commands.get( command ) ) {
        client.commands.get( command ).execute( message, args );
    }
});


client.login( token );

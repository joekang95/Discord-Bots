const discord = require( 'discord.js' );
const fs = require( 'fs' );

const client = new discord.Client( { partials: ['MESSAGE', 'CHANNEL', 'REACTION' ] } );
client.commands = new discord.Collection();

const { prefix, token } = require( './config/config.json');

const commandfiles = fs.readdirSync( './commands/' ).filter( file => file.endsWith('.js') );
for ( const file of commandfiles ) 
{
    const command = require( `./commands/${file}`) ;
    client.commands.set( command.name, command );
}

client.on( 'message', message => 
{
    if ( !message.content.startsWith( prefix ) || message.author.bot ) 
    {
        return;
    }

    const args = message.content.slice( prefix.length ).split( / +/ );
    const command = args.shift().toLowerCase();

    if ( command === 'poll' ) {
        client.commands.get( command ).execute( message, args, discord );
    }
});


client.login( token );

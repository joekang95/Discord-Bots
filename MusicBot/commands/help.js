module.exports =
{
    name: 'help',
    description: 'help command',
    execute( message, args ) {
        message.channel.send( '``` !music play [ youtube link ]\n !music skip\n !music list```');
    }
}
module.exports =
{
    name: 'roles',
    description: 'roles command',
    execute(message, args) {
        if(!args.length)
        {
            return message.channel.send('Rock');
        }
        console.log(args);
    }
}
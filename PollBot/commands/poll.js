module.exports =
{
    name: 'poll',
    description: 'poll command',
    async execute( message, args, discord ) {

        if( !args[ 0 ] )
        {
            return;
        }

        const numbers = [ '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣' ];
        console.log( args );
        const params = args[ 0 ].split( '\n' );
        var question = `**${ params[ 0 ] }**\n\n`;

        const options = params.length - 1;
        for( i = 0; i < options; ++i )
        {
           question += `${ numbers[ i ] }: ${ params[ i + 1 ] }\n\n`;
        }

        const messageEmbed = new discord.MessageEmbed()
        .setColor( '#e42643' )
        .setTitle( '選ぶ' )
        .setDescription( question );

        const messageSend = await message.channel.send( messageEmbed );

        for( i = 0; i < options; ++i )
        {
            messageSend.react( numbers[ i ] );
        }
    }
}
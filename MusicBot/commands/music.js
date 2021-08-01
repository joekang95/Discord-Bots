const ytdl = require( 'ytdl-core' );
const ytsearch = require( 'yt-search' );

module.exports =
{
    name: 'music',
    description : 'music command',
    async execute( message, args )
    {
        const voicechannel = message.member.voice.channel;
        if( !voicechannel )
        {
            return message.channel.send( 'You need to be in a channel to use this command' );
        }

        const permissions = voicechannel.permissionsFor( message.client.user );
        if( !permissions.has( 'CONNECT' ) )
        {
            return message.channel.send( 'You don\'t have permsion' );
        }
        
        switch( args[ 0 ] )
        {
            case 'play':
            
                if( !args[ 1 ] )
                {
                    return;
                }

                play( message, args );
                break;
            case 'stop':
                stop( message );
                break;
            case 'skip':
                skip( message );
                break;
            case 'list':
                list( message );
                break;

        }
    }
}

const servers = {};
const play = async ( message, args ) =>
{
    if( !servers[ message.guild.id ] )
    {
        servers[ message.guild.id ] = 
        { 
            voicechannel: message.member.voice.channel,
            textchannel: message.channel,
            connection: null,
            songs: [] 
        };
    }

    var server = servers[ message.guild.id ];
    if( ytdl.validateURL( args[ 1 ] ) )
    {
        const info = await ytdl.getInfo( args[ 1 ]  );
        server.songs.push( { title: info.videoDetails.title, url: info.videoDetails.video_url } );
    }
    else
    {
        const finder = async ( query ) =>
        {
            const result = await ytsearch( query );
            return ( result.videos.length > 0 ) ? result.videos[ 0 ] : null;
        }
        const video = await finder( args.join( ' ' ) );
        if( video )
        {
            server.songs.push( { title: video.title, url: video.url } );
        }
        else
        {
            server.textchannel.send( 'Error finding video' );
        }
    }

    if( !server.connection )
    {
        server.connection = await server.voicechannel.join();
        playSong( message.guild.id );
    }
    else
    {
        const last = server.songs.length - 1;
        server.textchannel.send( `Song added: ***${ server.songs[ last ].title }***`);
    }

    return;
    
};

const playSong = async ( id ) =>
{
    var server = servers[ id ];

    if( server.songs.length == 0 )
    {
        server.voicechannel.leave();
        servers[ id ] = null;
        return;
    }

    const stream = ytdl( server.songs[ 0 ].url, { filter: 'audioonly' } );

    server.connection.play( stream, { seek: 0, volume : 1 } )
    .on( 'finish', () => 
    {
        server.songs.shift();
        playSong( id );
    } );

    await server.textchannel.send( `🎵 Now Playing: ***${ server.songs[ 0 ].title }*** 🎵`);
}

const stop = async ( message ) =>
{
    var server = servers[ message.guild.id ];
    server.songs = [];
    server.connection.dispatcher.end();
}

const skip = async ( message ) =>
{
    var server = servers[ message.guild.id ];
    if( !server.queue )
    {
        return server.textchannel.send( `There are no songs left` );
    }
    server.connection.dispatcher.end();
}

const list = ( message ) =>
{
    var server = servers[ message.guild.id ];
    
    const hasQueue = server.songs.length > 0;
    var text = ( hasQueue ) ? '```' : '';
    if( hasQueue )
    {
        for( index = 0; index < server.songs.length; ++index )
        {
            const title = server.songs[ index ].title;
            if( index == 0 )
            {
                text +=  `diff\n- 🎵${ index }. ${ title }🎵 \n`;
                continue;
            }
            text += `${ index }. ${ title } \n`;
        }
        text += '```';
    }
    server.textchannel.send( text );
}

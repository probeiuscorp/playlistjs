import { PagePlaylist } from ':/components/playlist/PagePlaylist';
import { GetServerSideProps } from 'next';
import { Playlist, getPlaylistById } from ':/models/Playlists';

export default PagePlaylist;

export const getServerSideProps: GetServerSideProps<Playlist> = async (context) => {
    const id = context.params?.id;
    if(typeof id !== 'string')
        return { notFound: true };
    
    const playlist = await getPlaylistById(id);
    if(playlist === null)
        return { notFound: true };

    return {
        props: {
            id: playlist.id,
            directory: playlist.directory,
        },
    };
};
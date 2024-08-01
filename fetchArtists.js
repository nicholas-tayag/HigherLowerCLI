import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId:  'f1c2948a00fd4541922b6333322c0494', //ENTER ID HERE
  clientSecret: '003827bffd9b4755b8f97c0d0dd2a788', //ENTER SECRETID HERE
});

export const fetchArtistsData = () => {
    return spotifyApi.clientCredentialsGrant()
      .then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
        return spotifyApi.searchArtists('a', { limit: 50 });
      })
      .then(data => {
        return data.body.artists.items.map(artist => ({
          id: artist.id,
          name: artist.name,
          followers: artist.followers.total,
          image: artist.images.length > 0 ? artist.images[0].url : null
        }));
      })
      .catch(err => {
        console.error('Error retrieving artists', err);
        return [];
      });
  };

const CLIENT_ID = 'client id';
const CLIENT_SECRET = 'client secret';
let ACCESS_TOKEN = '';

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

async function searchSongs() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  try {
    if (!ACCESS_TOKEN) {
      ACCESS_TOKEN = await getAccessToken();
    }

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`, {
      headers: {
        'Authorization': 'Bearer ' + ACCESS_TOKEN
      }
    });

    const data = await response.json();
    showResults(data.tracks.items);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('results').innerHTML = '<p>Erro ao buscar músicas (adicione o token da api)</p>';
  }
}

function showResults(songs) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!songs || songs.length === 0) {
    resultsDiv.innerHTML = '<p>Nenhuma música encontrada</p>';
    return;
  }

  songs.forEach(song => {
    const songDiv = document.createElement('div');
    songDiv.className = 'song';
    songDiv.innerHTML = `
            <img src="${song.album.images[0]?.url || 'https://via.placeholder.com/150'}" alt="${song.name}">
            <h3>${song.name}</h3>
            <p>${song.artists.map(artist => artist.name).join(', ')}</p>
            <p>${song.album.name}</p>
        `;
    resultsDiv.appendChild(songDiv);
  });
}
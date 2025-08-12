let ACCESS_TOKEN = '';

async function getAccessToken() {
  const response = await fetch('/.netlify/functions/get-spotify-token');
  const data = await response.json();
  
  if (!response.ok) {
      throw new Error(data.error || 'Failed to get access token');
  }
  
  return data.accessToken;
}

async function searchSongs() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) return;

  try {
    if (!ACCESS_TOKEN) {
      ACCESS_TOKEN = await getAccessToken();
    }
    
    // A URL CORRETA para a busca está aqui: https://api.spotify.com/v1/search
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`, {
      headers: {
        'Authorization': 'Bearer ' + ACCESS_TOKEN
      }
    });

    const data = await response.json();
    showResults(data.tracks.items);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('results').innerHTML = '<p>Erro ao buscar músicas. Verifique a API e a conexão.</p>';
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
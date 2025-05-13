function search() {
    const query = document.getElementById("searchInput").value;
    if (query) {
      alert(`Você está buscando por: ${query}`);
    } else {
      alert("Por favor, insira um termo para buscar.");
    }
  }
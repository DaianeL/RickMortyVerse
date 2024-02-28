const characterUrlApi = "https://rickandmortyapi.com/api/character";

// Sessão Personagens
function fetchCharacters() {
  fetch(characterUrlApi)
    .then((response) => response.json())
    .then((data) => {
      const characters = data.results;
      const characterSelect = document.getElementById("characterSelect");

      characters.forEach((character) => {
        const option = document.createElement("option");
        option.text = character.name;
        option.value = character.id;
        characterSelect.add(option);
      });

      if (data.info.next) {
        fetchMoreCharacters(data.info.next);
      } else {
        updateCharacter();
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar os dados dos personagens:", error);
    });
}

// Função para buscar mais personagens se houver mais páginas.
function fetchMoreCharacters(url) {
  fetch(url)
    .then((response) => response.json())

    .then((data) => {
      // manipula os dados JSON
      const characters = data.results; // Extrai os personagens dos dados.
      const characterSelect = document.getElementById("characterSelect");

      characters.forEach((character) => {
        const option = document.createElement("option");
        option.text = character.name;
        option.value = character.id;
        characterSelect.add(option);
      });

      if (data.info.next) {
        fetchMoreCharacters(data.info.next);
      } else {
        updateCharacter();
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar mais dados:", error);
    });
}

// Função para atualizar os detalhes do personagem selecionado.
function updateCharacter() {
  const characterId = document.getElementById("characterSelect").value;
  const characterUrl = `${characterUrlApi}/${characterId}`;

  fetch(characterUrl)
    .then((response) => response.json())
    .then((character) => {
      const characterImage = document.getElementById("characterImage");
      const characterIdElement = document.getElementById("characterId");
      const characterNameElement = document.getElementById("characterName");

      characterImage.src = character.image;
      characterIdElement.innerHTML =
        `<strong>Identificação: </strong>` + character.id;
      characterNameElement.innerHTML =
        `<strong>Personagem: </strong>` + character.name;
    })
    .catch((error) => {
      console.error("Erro ao buscar os detalhes do personagem:", error);
    });
}

fetchCharacters();

// Sessão Localizações + Personagens por localização selecionada.
document.addEventListener("DOMContentLoaded", function () {
  const locationSelect = document.getElementById("locationSelect");
  const characterSelect = document.getElementById("charactersLocationSelect");

  fetch("https://rickandmortyapi.com/api/location")
    .then((response) => response.json())
    .then((data) => {
      populateLocationsDropdown(data.results);
      fetchCharactersByLocation(data.results[0].url);
    });

  const populateLocationsDropdown = (locations) => {
    locations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location.url;
      option.textContent = location.name;
      locationSelect.appendChild(option);
    });
  };

  const populateCharactersDropdown = (characters) => {
    characters.forEach((character) => {
      const option = document.createElement("option");
      option.value = character.id;
      option.textContent = character.name;
      characterSelect.appendChild(option);
    });
  };

  const fetchCharactersByLocation = (locationUrl) => {
    fetch(locationUrl)
      .then((response) => response.json())
      .then((locationData) => {
        document.getElementById("location-title").textContent =
          locationData.name;
        document.getElementById("location-type").textContent =
          locationData.type;
        document.getElementById("location-dimension").textContent =
          locationData.dimension;

        //characterSelect.innerHTML = "";

        Promise.all(
          locationData.residents.map((residentUrl) =>
            fetch(residentUrl).then((response) => response.json())
          )
        ).then((characters) => {
          populateCharactersDropdown(characters);
        });
      });
  };

  locationSelect.addEventListener("change", function () {
    const selectedLocationUrl = this.value;
    fetchCharactersByLocation(selectedLocationUrl);
  });

  characterSelect.addEventListener("change", function () {
    const selectedCharacterId = this.value;
    const characterUrl = `${characterUrlApi}/${selectedCharacterId}`;

    fetch(characterUrl)
      .then((response) => response.json())
      .then((character) => {
        const characterImage = document.getElementById("characterImage");
        const characterIdElement = document.getElementById("characterId");
        const characterNameElement = document.getElementById("characterName");

        characterImage.src = character.image;
        characterIdElement.textContent = "Identificação: " + character.id;
        characterNameElement.textContent = "Personagem: " + character.name;

        const characterCard = document.getElementById("characterCard");
        characterCard.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch((error) => {
        console.error("Erro ao buscar os detalhes do personagem:", error);
      });
  });
});

// Doc sessão localização
document
  .getElementById("characterSelect")
  .addEventListener("change", updateCharacter);

// Sessão Episódios + Personagens por episódio selecionado.
document.addEventListener("DOMContentLoaded", function () {
  const episodeSelect = document.getElementById("episodesSelect");
  const characterSelectEp = document.getElementById("characterEpisodesSelect");

  fetch("https://rickandmortyapi.com/api/episode")
    .then((response) => response.json())
    .then((data) => {
      populateEpisodesDropdown(data.results);
      fetchCharactersByEpisode(data.results[0].url);
    });

  const populateEpisodesDropdown = (episodes) => {
    episodes.forEach((episode) => {
      const option = document.createElement("option");
      option.value = episode.url;
      option.textContent = episode.name;
      episodeSelect.appendChild(option);
    });
  };

  const populateCharactersDropdownEpisodes = (charactersEp) => {
    charactersEp.forEach((characterEp) => {
      const option = document.createElement("option");
      option.value = characterEp.id;
      option.textContent = characterEp.name;
      characterSelectEp.appendChild(option);
    });
  };

  const fetchCharactersByEpisode = (episodeUrl) => {
    fetch(episodeUrl)
      .then((response) => response.json())
      .then((episodeData) => {
        document.getElementById("episodeName").textContent = episodeData.name;
        document.getElementById("episodeTag").textContent = episodeData.id;
        document.getElementById("episodeDate").textContent =
          episodeData.air_date;

        //characterSelectEp.innerHTML =" ";

        Promise.all(
          episodeData.characters.map((characterUrl) =>
            fetch(characterUrl).then((response) => response.json())
          )
        ).then((characters) => {
          populateCharactersDropdownEpisodes(characters);
        });
      });
  };

  episodeSelect.addEventListener("change", function () {
    const selectedEpisodeUrl = this.value;
    fetchCharactersByEpisode(selectedEpisodeUrl);
  });

  characterSelectEp.addEventListener("change", function () {
    const selectedCharacterId = this.value;
    const characterUrl = `${characterUrlApi}/${selectedCharacterId}`;

    fetch(characterUrl)
      .then((response) => response.json())
      .then((character) => {
        const characterImage = document.getElementById("characterImage");
        const characterIdElement = document.getElementById("characterId");
        const characterNameElement = document.getElementById("characterName");

        characterImage.src = character.image;
        characterIdElement.textContent = "Identificação: " + character.id;
        characterNameElement.textContent = "Personagem: " + character.name;

        const characterCardEp = document.getElementById("characterCard");
        characterCardEp.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch((error) => {
        console.error("Erro ao buscar os detalhes do personagem:", error);
      });
  });
});

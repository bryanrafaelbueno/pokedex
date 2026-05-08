document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.pokemonsContainer');
    const loadingElement = document.getElementById('loading');
    const BATCH_SIZE = 30;
    const CONCURRENT_REQUESTS = 10;
    let currentOffset = 0;
    let isLoading = false;
    let allPokemonList = [];

    // Capitalize type names efficiently
    const formatTypeName = (type) => {
        return type
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('-');
    };

    // Fetch multiple Pokémon in parallel with concurrency control
    async function fetchPokemonBatch(ids) {
        const results = [];
        for (let i = 0; i < ids.length; i += CONCURRENT_REQUESTS) {
            const batch = ids.slice(i, i + CONCURRENT_REQUESTS);
            const promises = batch.map(id =>
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                    .then(r => r.json())
                    .catch(() => null)
            );
            const batchResults = await Promise.all(promises);
            results.push(...batchResults.filter(p => p));
        }
        return results;
    }

    // Create a single card HTML element
    function createPokemonCard(pokemon) {
        const img = pokemon.sprites.front_default;
        if (!img) return null;

        const types = pokemon.types
            .map(t => formatTypeName(t.type.name))
            .join(" / ");
        const hp = pokemon.stats.find(s => s.stat.name === "hp")?.base_stat;
        const atk = pokemon.stats.find(s => s.stat.name === "attack")?.base_stat;
        const def = pokemon.stats.find(s => s.stat.name === "defense")?.base_stat;
        const height = (pokemon.height / 10).toFixed(1);
        const weight = (pokemon.weight / 10).toFixed(1);

        const card = document.createElement("div");
        card.className = "pokemonCard";

        const inner = document.createElement("div");
        inner.className = "pokemonInner";

        const front = document.createElement("div");
        front.className = "pokemonFront";
        front.innerHTML = `
            <img src="${img}" alt="${pokemon.name}" class="pokemonImage" loading="lazy">
            <p class="pokemonName">${pokemon.name}</p>
        `;

        const back = document.createElement("div");
        back.className = "pokemonBack";
        back.innerHTML = `
            <h3>${pokemon.name}</h3>
            <p><b>Types:</b> ${types}</p>
            <p><b>HP:</b> ${hp}</p>
            <p><b>ATK:</b> ${atk} | DEF: ${def}</p>
            <p><b>Height:</b> ${height} m</p>
            <p><b>Weight:</b> ${weight} kg</p>
        `;

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);
        return card;
    }

    // Batch render cards for better performance
    async function renderPokemonBatch(pokemons) {
        const fragment = document.createDocumentFragment();
        let count = 0;

        for (const pokemon of pokemons) {
            const card = createPokemonCard(pokemon);
            if (card) {
                fragment.appendChild(card);
                count++;
            }
        }

        if (count > 0) {
            container.appendChild(fragment);
        }
        return count;
    }

    // Load initial Pokemon list
    async function loadPokemonList() {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
            const data = await response.json();
            allPokemonList = data.results;
            loadMorePokemons();
        } catch (err) {
            console.error("Erro ao carregar lista de Pokémons:", err);
        }
    }

    // Load and render next batch
    async function loadMorePokemons() {
        if (isLoading || currentOffset >= allPokemonList.length) return;

        isLoading = true;
        loadingElement.style.display = 'block';

        try {
            const batch = allPokemonList.slice(currentOffset, currentOffset + BATCH_SIZE);
            const ids = batch.map(p => p.url.split('/')[6]);

            const pokemons = await fetchPokemonBatch(ids);
            await renderPokemonBatch(pokemons);

            currentOffset += BATCH_SIZE;
        } catch (err) {
            console.error("Erro ao carregar Pokémons:", err);
        } finally {
            isLoading = false;
            loadingElement.style.display = 'none';
        }
    }

    // Infinite scroll implementation
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.innerHeight + window.scrollY) / document.documentElement.scrollHeight;
        if (scrollPercentage > 0.8 && !isLoading) {
            loadMorePokemons();
        }
    });

    // Initial load
    loadPokemonList();
});
document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.pokemonsContainer');
    const loadingElement = document.getElementById('loading');
    const counterElement = document.getElementById('pokemonCounter');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const BATCH_SIZE = 30;
    const CONCURRENT_REQUESTS = 10;
    let currentOffset = 0;
    let isLoading = false;
    let allPokemonList = [];
    let totalLoaded = 0;

    // ─── Type color map ───
    const TYPE_COLORS = {
        normal:   '#A8A878', fire:     '#F08030', water:    '#6890F0',
        electric: '#F8D030', grass:    '#78C850', ice:      '#98D8D8',
        fighting: '#C03028', poison:   '#A040A0', ground:   '#E0C068',
        flying:   '#A890F0', psychic:  '#F85888', bug:      '#A8B820',
        rock:     '#B8A038', ghost:    '#705898', dragon:   '#7038F8',
        dark:     '#705848', steel:    '#B8B8D0', fairy:    '#EE99AC',
    };

    // ─── Stat color map ───
    const STAT_COLORS = {
        hp:                '#ff5555',
        attack:            '#f0a030',
        defense:           '#68b8f0',
        'special-attack':  '#f85888',
        'special-defense': '#78c850',
        speed:             '#f8d030',
    };

    // Capitalize type names
    const formatTypeName = (type) => {
        return type
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('-');
    };

    // Fetch Pokémon in parallel with concurrency control
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

    // Create type badge element
    function createTypeBadge(typeName) {
        const badge = document.createElement('span');
        badge.className = 'type-badge';
        badge.textContent = formatTypeName(typeName);
        badge.style.backgroundColor = TYPE_COLORS[typeName] || '#888';
        return badge;
    }

    // Create a stat bar row
    function createStatRow(label, value, color) {
        const maxStat = 255;
        const percentage = Math.min((value / maxStat) * 100, 100);

        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
            <span class="stat-label">${label}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${percentage}%; background: ${color};"></div>
            </div>
            <span class="stat-value">${value}</span>
        `;
        return row;
    }

    // Create a single card element
    function createPokemonCard(pokemon, index) {
        const img = pokemon.sprites.front_default;
        if (!img) return null;

        const primaryType = pokemon.types[0]?.type.name || 'normal';
        const accentColor = TYPE_COLORS[primaryType] || '#888';

        const card = document.createElement("div");
        card.className = "pokemonCard";
        card.style.setProperty('--card-accent', accentColor);
        // Staggered animation delay
        card.style.animationDelay = `${(index % BATCH_SIZE) * 30}ms`;

        const inner = document.createElement("div");
        inner.className = "pokemonInner";

        // ─── FRONT ───
        const front = document.createElement("div");
        front.className = "pokemonFront";

        // ID badge
        const idBadge = document.createElement('span');
        idBadge.className = 'pokemonId';
        idBadge.textContent = `#${String(pokemon.id).padStart(3, '0')}`;
        front.appendChild(idBadge);

        // Image
        const imgEl = document.createElement('img');
        imgEl.src = img;
        imgEl.alt = pokemon.name;
        imgEl.className = 'pokemonImage';
        imgEl.loading = 'lazy';
        front.appendChild(imgEl);

        // Name
        const nameEl = document.createElement('p');
        nameEl.className = 'pokemonName';
        nameEl.textContent = pokemon.name;
        front.appendChild(nameEl);

        // Type badges
        const typesContainer = document.createElement('div');
        typesContainer.className = 'pokemonTypes';
        pokemon.types.forEach(t => {
            typesContainer.appendChild(createTypeBadge(t.type.name));
        });
        front.appendChild(typesContainer);

        // ─── BACK ───
        const back = document.createElement("div");
        back.className = "pokemonBack";

        // Name
        const backName = document.createElement('h3');
        backName.textContent = pokemon.name;
        back.appendChild(backName);

        // Type badges (back)
        const backTypes = document.createElement('div');
        backTypes.className = 'back-types';
        pokemon.types.forEach(t => {
            backTypes.appendChild(createTypeBadge(t.type.name));
        });
        back.appendChild(backTypes);

        // Stat bars
        const statsToShow = ['hp', 'attack', 'defense', 'speed'];
        const statLabels = { hp: 'HP', attack: 'ATK', defense: 'DEF', speed: 'SPD' };

        statsToShow.forEach(statName => {
            const stat = pokemon.stats.find(s => s.stat.name === statName);
            if (stat) {
                back.appendChild(
                    createStatRow(
                        statLabels[statName],
                        stat.base_stat,
                        STAT_COLORS[statName] || '#888'
                    )
                );
            }
        });

        // Physical info
        const physical = document.createElement('div');
        physical.className = 'back-physical';
        physical.innerHTML = `
            <span><b>${(pokemon.height / 10).toFixed(1)}</b> m</span>
            <span><b>${(pokemon.weight / 10).toFixed(1)}</b> kg</span>
        `;
        back.appendChild(physical);

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);
        return card;
    }

    // Batch render cards
    async function renderPokemonBatch(pokemons) {
        const fragment = document.createDocumentFragment();
        let count = 0;

        for (const pokemon of pokemons) {
            const card = createPokemonCard(pokemon, totalLoaded + count);
            if (card) {
                fragment.appendChild(card);
                count++;
            }
        }

        if (count > 0) {
            container.appendChild(fragment);
            totalLoaded += count;
            updateCounter();
        }
        return count;
    }

    // Update the counter badge
    function updateCounter() {
        if (counterElement) {
            counterElement.textContent = `${totalLoaded} Pokémons carregados`;
        }
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
        loadingElement.style.display = 'flex';

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

    // Infinite scroll
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.innerHeight + window.scrollY) / document.documentElement.scrollHeight;
        if (scrollPercentage > 0.8 && !isLoading) {
            loadMorePokemons();
        }

        // Scroll-to-top button visibility
        if (window.scrollY > 600) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initial load
    loadPokemonList();
});
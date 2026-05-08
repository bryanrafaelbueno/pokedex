document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector('.pokemonsContainer');

    async function loadPokemons() {
        try {
            const response = await fetch(
                'https://pokeapi.co/api/v2/pokemon?limit=4000&offset=0'
            );

            const data = await response.json();

            for (const pokemon of data.results) {
                const id = pokemon.url.split('/')[6];

                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const poke = await res.json();

                const img = poke.sprites.front_default;

                // Skip this Pokémon if image is null
                if (!img) continue;

                const types = poke.types
                    .map(t => t.type.name
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join('-'))
                    .join(" / ");
                const hp = poke.stats.find(s => s.stat.name === "hp")?.base_stat;
                const atk = poke.stats.find(s => s.stat.name === "attack")?.base_stat;
                const def = poke.stats.find(s => s.stat.name === "defense")?.base_stat;
                const height = poke.height / 10;
                const weight = poke.weight / 10;

                const card = document.createElement("div");
                card.classList.add("pokemonCard");

                const inner = document.createElement("div");
                inner.classList.add("pokemonInner");

                /* FRONT */
                const front = document.createElement("div");
                front.classList.add("pokemonFront");

                const image = document.createElement("img");
                image.src = img;
                image.classList.add("pokemonImage");

                const name = document.createElement("p");
                name.innerText = pokemon.name;
                name.classList.add("pokemonName");

                front.appendChild(image);
                front.appendChild(name);

                /* BACK */
                const back = document.createElement("div");
                back.classList.add("pokemonBack");

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
                container.appendChild(card);
            }

        } catch (err) {
            console.log("Erro ao carregar Pokémons:", err);
        }
    }

    loadPokemons();
});
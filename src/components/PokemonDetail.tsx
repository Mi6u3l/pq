import { PokemonDetails } from "../types/pokemon";

function PokemonDetail({ pokemon }: { pokemon: PokemonDetails }) {
    const getStatValue = (statName: string) => 
        pokemon.stats?.find((stat: { stat: { name: string } }) => stat.stat.name === statName)?.base_stat ?? 0;

    const details = {
        height: pokemon.height,
        weight: pokemon.weight,
        types: pokemon.types.map((type: { type: { name: string } }) => type.type.name),
        sprite: pokemon.sprites.front_default,
        stats: {
            hp: getStatValue("hp"),
            attack: getStatValue("attack"),
            defense: getStatValue("defense"),
            specialAttack: getStatValue("special-attack"),
            specialDefense: getStatValue("special-defense"),
            speed: getStatValue("speed"),
        }
    };

    return (
        <article 
            className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
            aria-labelledby="pokemon-name"
        >
            <h2 
                id="pokemon-name" 
                className="text-3xl font-bold text-gray-800 capitalize mb-6 text-center"
            >
                {pokemon?.name}
            </h2>
            <div className="flex justify-center mb-6">
            <img
                src={details.sprite}
                alt={`${pokemon.name} sprite`}
                className="w-24 h-24 object-contain"
            />
            </div>
            <section className="mb-8" aria-label="Pokemon stats">
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <dt className="text-gray-600 text-sm font-medium mb-1">Height</dt>
                        <dd className="text-gray-900 text-lg font-semibold">{details.height}</dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <dt className="text-gray-600 text-sm font-medium mb-1">Weight</dt>
                        <dd className="text-gray-900 text-lg font-semibold">{details.weight}</dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <dt className="text-gray-600 text-sm font-medium mb-1">HP</dt>
                        <dd className="text-gray-900 text-lg font-semibold">{details.stats.hp}</dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <dt className="text-gray-600 text-sm font-medium mb-1">Attack</dt>
                        <dd className="text-gray-900 text-lg font-semibold">{details.stats.attack}</dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <dt className="text-gray-600 text-sm font-medium mb-1">Defense</dt>
                        <dd className="text-gray-900 text-lg font-semibold">{details.stats.defense}</dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <dt className="text-gray-600 text-sm font-medium mb-1">Special Attack</dt>
                        <dd className="text-gray-900 text-lg font-semibold">{details.stats.specialAttack}</dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <dt className="text-gray-600 text-sm font-medium mb-1">Special Defense</dt>
                        <dd className="text-gray-900 text-lg font-semibold">{details.stats.specialDefense}</dd>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <dt className="text-gray-600 text-sm font-medium mb-1">Speed</dt>
                        <dd className="text-gray-900 text-lg font-semibold">{details.stats.speed}</dd>
                    </div>
                </dl>
            </section>

            <section className="mt-6" aria-label="Pokemon types">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Types</h3>
                <ul className="flex flex-wrap gap-2">
                    {details.types.map((type, index) => (
                        <li 
                            key={index} 
                            className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-medium capitalize"
                        >
                            {type}
                        </li>
                    ))}
                </ul>
            </section>
        </article>
    );
}

export default PokemonDetail;
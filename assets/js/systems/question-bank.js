/* Sorteio por fase, dificuldade e objetivo, sem alterar o banco de origem. */
const QuestionBank = (() => {
  // A rotação dura enquanto a página estiver aberta, inclusive entre partidas.
  // Nenhum progresso ou resposta é gravado no navegador.
  const decks = new Map();

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function draw(pool, key) {
    let deck = decks.get(key);
    const ids = new Set(pool.map(mission => mission.id));
    if (deck) deck.remaining = deck.remaining.filter(id => ids.has(id));
    if (!deck?.remaining.length) {
      const remaining = shuffle([...ids]);
      // Evita repetir o último item ao iniciar outra volta do banco.
      if (remaining.length > 1 && remaining.at(-1) === deck?.last) {
        remaining.unshift(remaining.pop());
      }
      deck = { remaining, last: deck?.last };
      decks.set(key, deck);
    }
    deck.last = deck.remaining.pop();
    return pool.find(mission => mission.id === deck.last);
  }

  function prepare(mission) {
    if (mission.type === 'matching') {
      return {
        ...mission,
        pairs: shuffle(mission.pairs).map(pair => ({ ...pair })),
        targets: shuffle(mission.targets)
      };
    }
    const order = shuffle(mission.choices.map((_, index) => index));
    return {
      ...mission,
      choices: order.map(index => mission.choices[index]),
      correct: order.indexOf(mission.correct)
    };
  }

  function select(bank, difficulty, room) {
    const pool = bank?.[difficulty]?.[room] || [];
    const objectives = [...new Set(pool.map(mission => mission.objective))];
    const selected = objectives.map(objective => draw(
      pool.filter(mission => mission.objective === objective),
      `${difficulty}:${room}:${objective}`
    ));
    return shuffle(selected).map(prepare);
  }

  return { shuffle, select };
})();

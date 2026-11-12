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
    if (mission.type === 'memory') {
      return {
        ...mission,
        pairs: mission.pairs.map(pair => ({...pair})),
        cards: shuffle(mission.pairs.flatMap(pair => [
          { id: `${pair.id}-left`, pairId: pair.id, text: pair.left },
          { id: `${pair.id}-right`, pairId: pair.id, text: pair.right }
        ]))
      };
    }
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
    if (room === 'sala4' && selected.length) {
      const candidates = selected.filter(mission => mission.type === 'choice');
      const replaced = candidates.find(mission => mission.objective === 'reutilizar') || shuffle(candidates)[0];
      const data = MEMORY_DATA[difficulty];
      // A reutilização é o objetivo desta missão; os demais pares variam.
      const selectedPairs = [data.pairs[0], ...shuffle(data.pairs.slice(1))].slice(0, data.count);
      const pairs = selectedPairs.map(([left,right],index) => ({ id:`memory-${index}`,left,right }));
      selected[selected.indexOf(replaced)] = {
        id: `sala4-${difficulty}-memoria`,
        replacesId: replaced.id,
        objective: replaced.objective,
        type: 'memory',
        title: 'Central de Controle — Jogo da memória',
        desc: `Encontre ${data.count} pares de código e significado. Vire duas cartas por vez. ${data.errorLimit === 0 ? 'Nenhum erro permitido: o primeiro par incorreto encerra a missão.' : `A missão termina no ${data.errorLimit}º par incorreto.`} Não há limite de tempo.`,
        errorLimit: data.errorLimit,
        code: '',
        pairs,
        success: 'Você encontrou os pares e revisou dados e ações do programa!',
        hint: 'Leia cada código e pense no que ele faz.',
        explanation: pairs.map(pair => `${pair.left} → ${pair.right}`).join('; ') + '.'
      };
    }
    return shuffle(selected).map(prepare);
  }

  return { shuffle, select };
})();

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const bank = JSON.parse(read('assets/js/data/missions.json'));
const snapshot = JSON.stringify(bank);
let seed = 17412;
const seededMath = Object.create(Math);
seededMath.random = () => {
  seed = (1664525 * seed + 1013904223) >>> 0;
  return seed / 2 ** 32;
};
const context = vm.createContext({ Math: seededMath, resetScoreSent() {} });
vm.runInContext(read('assets/js/data/memory-data.js'), context);
vm.runInContext(read('assets/js/systems/question-bank.js') + '\nglobalThis.bankSystem = QuestionBank;', context);
vm.runInContext(read('assets/js/core/state.js') + '\nglobalThis.state = GameState;', context);
const system = context.bankSystem;
const ids = new Set();
let count = 0;

for (const [difficulty, rooms] of Object.entries(bank)) {
  assert.ok(['facil', 'medio', 'dificil'].includes(difficulty));
  assert.equal(Object.keys(rooms).length, 4);
  for (const [room, pool] of Object.entries(rooms)) {
    assert.equal(pool.length, 10, `${room}/${difficulty}: dez questões`);
    assert.equal(new Set(pool.map(item => item.objective)).size, 5);
    const groups = new Map();
    for (const item of pool) {
      count++;
      assert.ok(!ids.has(item.id), `ID único: ${item.id}`);
      ids.add(item.id);
      for (const key of ['title', 'desc', 'success', 'hint', 'explanation', 'objective']) {
        assert.ok(typeof item[key] === 'string' && item[key].trim(), `${item.id}/${key}`);
      }
      assert.equal(typeof item.code, 'string');
      assert.ok(!/arrast/i.test(item.desc), 'Enunciado não exige arrastar');
      if (item.type === 'matching') {
        assert.equal(item.objective, 'associar-conceitos');
        assert.ok(item.pairs.length >= 2);
        assert.equal(new Set(item.pairs.map(pair => pair.id)).size, item.pairs.length);
        assert.equal(new Set(item.targets).size, item.targets.length);
        for (const pair of item.pairs) assert.ok(item.targets.includes(pair.right));
      } else {
        assert.equal(item.type, 'choice');
        assert.ok(Number.isInteger(item.correct) && item.correct >= 0 && item.correct < item.choices.length);
        assert.ok(item.choices.length >= 2);
        assert.equal(new Set(item.choices).size, item.choices.length);
      }
      if (!groups.has(item.objective)) groups.set(item.objective, []);
      groups.get(item.objective).push(item);
    }
    const seen = new Set();
    const firstCycle = new Map([...groups].map(([objective]) => [objective, []]));
    const optionOrders = new Set();
    for (let draw = 0; draw < 30; draw++) {
      const selected = system.select(bank, difficulty, room);
      assert.equal(selected.length, 5);
      assert.equal(new Set(selected.map(item => item.id)).size, 5);
      assert.equal(new Set(selected.map(item => item.objective)).size, 5);
      assert.equal(selected.filter(item => item.type === 'matching').length, 1);
      assert.equal(selected.filter(item => item.type === 'memory').length, room === 'sala4' ? 1 : 0);
      for (const item of selected) {
        const sourceId = item.replacesId || item.id;
        seen.add(sourceId);
        const original = pool.find(original => original.id === sourceId);
        assert.ok(original, 'Respeita a fase e a dificuldade');
        assert.equal(item.objective, original.objective);
        if (item.type === 'choice') {
          assert.equal(item.choices[item.correct], original.choices[original.correct], 'Gabarito acompanha o embaralhamento');
          optionOrders.add(item.choices.join('|'));
        } else if (item.type === 'memory') {
          assert.equal(item.pairs.length, {facil:3,medio:4,dificil:5}[difficulty]);
          assert.equal(item.cards.length, item.pairs.length * 2);
          assert.equal(new Set(item.cards.map(card => card.id)).size, item.cards.length);
          for (const pair of item.pairs) assert.equal(item.cards.filter(card => card.pairId === pair.id).length, 2);
          assert.ok(item.pairs.some(pair => pair.left === 'Reutilizar uma função'));
        } else {
          assert.notStrictEqual(item.pairs, original.pairs);
          assert.notStrictEqual(item.pairs[0], original.pairs.find(pair => pair.id === item.pairs[0].id));
          assert.notStrictEqual(item.targets, original.targets);
        }
        const cycle = firstCycle.get(item.objective);
        const size = groups.get(item.objective).length;
        if (cycle.length < size) {
          assert.ok(!cycle.includes(sourceId), 'Cada variante aparece antes da repetição');
          cycle.push(sourceId);
        } else if (draw === size && size > 1) {
          assert.notEqual(sourceId, cycle.at(-1), 'Nova volta não repete a última questão');
        }
      }
    }
    assert.equal(seen.size, pool.length, 'Todas as questões podem participar do sorteio');
    assert.ok(optionOrders.size > 4, 'Alternativas variam');
    console.log(`OK: ${room}/${difficulty}, cobertura dos objetivos e rotação das dez variantes`);
  }
}
assert.equal(count, 120);
assert.equal(JSON.stringify(bank), snapshot, 'O banco original permanece intacto');
const state = context.state;
state.missionsData = bank;
state.difficulty = 'facil';
state.currentRoom = 'sala1';
const session = state.currentMissions();
assert.strictEqual(state.currentMissions(), session, 'Consultar a missão não sorteia de novo');
state.prepareRoomMissions();
assert.notStrictEqual(state.currentMissions(), session, 'Reiniciar prepara outra seleção');
state.resetFull();
assert.equal(Object.keys(state.missionSessions).length, 0, 'Nova partida descarta as sessões antigas');
assert.equal(state.currentRoom, 'sala1');
assert.equal(JSON.stringify(bank), snapshot);
console.log('OK: 120 questões válidas, gabaritos, associações reutilizáveis e sessões estáveis');

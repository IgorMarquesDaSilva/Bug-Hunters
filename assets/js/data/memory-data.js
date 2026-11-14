/* O mesmo tabuleiro de 16 peças em todos os níveis; muda apenas o limite de erros. */
const MEMORY_PAIRS = [
  ['Reutilizar uma função', 'Chamar a mesma ação novamente'],
  ['pontos = 20', 'Guardar uma pontuação'],
  ['função abrirPorta', 'Criar a ação abrirPorta'],
  ['chamar abrirPorta', 'Executar a ação abrirPorta'],
  ['nome = "Lia"', 'Guardar um nome'],
  ['portaAberta = false', 'Guardar se a porta está aberta'],
  ['energia = 50', 'Guardar a quantidade de energia'],
  ['retorne energia', 'Devolver o valor da energia']
];

const MEMORY_DATA = {
  facil: { count: 8, errorLimit: 6, pairs: MEMORY_PAIRS },
  medio: { count: 8, errorLimit: 5, pairs: MEMORY_PAIRS },
  dificil: { count: 8, errorLimit: 4, pairs: MEMORY_PAIRS }
};

/* Ajuda de teclado compartilhada pela barra lateral e pelos leitores nativos. */
window.ShortcutHelp = (() => {
  const groups = [
    {
      title: 'Navegação e respostas',
      entries: [
        ['Tab', 'Ir ao próximo controle. Durante uma pergunta, o foco permanece na atividade, incluindo o botão Consultar glossário.'],
        ['Enter', 'Acionar o botão focado ou escolher uma resposta. Nas associações, selecionar o item, ligar à resposta e confirmar.'],
        ['Tab e Enter', 'No jogo da memória, virar duas cartas. Antes do limite de erros, acionar Virar as cartas para continuar. São 16 peças nos três níveis. Limite de erros: fácil 6, médio 5 e difícil 4.'],
        ['Enter no título do resumo', 'Revelar todos os resultados imediatamente. Depois, usar Tab para consultar cada estatística e chegar aos botões.'],
        ['Espaço', 'Também aciona um botão focado.'],
        ['Shift + Tab', 'Voltar ao controle anterior. Este atalho é opcional.'],
        ['Setas / Home / End', 'Nas dificuldades e respostas, percorrer opções ou ir à primeira e à última.'],
        ['↑ / ↓ / Page Up / Page Down', 'Rolar o código ou um conteúdo de leitura quando ele estiver focado.']
      ]
    },
    {
      title: 'Exploração do mapa',
      entries: [
        ['W A S D / setas', 'Mover o personagem no mapa. Depois de fechar um apoio, essas teclas retomam o movimento sem precisar clicar no mapa.'],
        ['Enter', 'Abrir a missão quando aparecer o aviso de bug.'],
        ['R', 'Ouvir novamente a distância e a direção do bug mais próximo.'],
        ['Escape no painel', 'Devolver o foco à área de movimento depois de consultar as informações da barra lateral.'],
        ['Tab', 'No mapa, acessar Tutorial, Atalhos e Configurações. O glossário fica somente nas perguntas, pelo botão Consultar glossário.']
      ]
    },
    {
      title: 'Menu inicial',
      entries: [
        ['A', 'Jogar.'],
        ['W', 'Abrir configurações.'],
        ['D', 'Abrir acessibilidade.']
      ]
    },
    {
      title: 'Tutorial e janelas de apoio',
      entries: [
        ['→ / ←', 'No tutorial, avançar ou voltar uma etapa.'],
        ['R', 'No tutorial, narrar a etapa atual.'],
        ['Escape', 'Fechar tutorial, glossário, atalhos, configurações, acessibilidade ou aviso de bug. Na escolha de dificuldade, voltar ao menu.'],
        ['← / →', 'No controle de volume focado, diminuir ou aumentar o volume.']
      ]
    },
    {
      title: 'Acessibilidade',
      entries: [
        ['C', 'Ativar ou desativar o alto contraste.'],
        ['+ / =', 'Aumentar o tamanho da fonte.'],
        ['−', 'Diminuir o tamanho da fonte. Use a tecla de menos.'],
        ['Caps Lock + Espaço / Insert + Espaço', 'No Narrador do Windows, alternar o modo de varredura. Se WASD ou as setas estiverem lendo a página, desligue esse modo para mover o personagem no mapa.']
      ]
    }
  ];

  function render() {
    const content = document.getElementById('shortcuts-content');
    if (!content || content.childElementCount) return;
    groups.forEach(group => {
      const section = document.createElement('section');
      section.className = 'shortcuts-group';
      section.tabIndex = 0;
      section.setAttribute('role', 'group');
      section.setAttribute('aria-label', `${group.title}. ${group.entries.map(([keys, description]) => `${keys}: ${description}`).join(' ')}`);
      const heading = document.createElement('h3');
      heading.textContent = group.title;
      const list = document.createElement('dl');
      group.entries.forEach(([keys, description]) => {
        const row = document.createElement('div');
        row.className = 'shortcuts-row';
        const term = document.createElement('dt');
        const badge = document.createElement('kbd');
        badge.textContent = keys;
        term.appendChild(badge);
        const details = document.createElement('dd');
        details.textContent = description;
        row.append(term, details);
        list.appendChild(row);
      });
      section.append(heading, list);
      content.appendChild(section);
    });
  }

  function open() {
    if (UI.getActiveScreen() === 'screen-shortcuts') return;
    render();
    document.getElementById('shortcuts-content').scrollTop = 0;
    UI.openSupport('screen-shortcuts');
    window.AccessibilitySystem?.announce?.('Atalhos do jogo. Use as setas para rolar a lista. Tab leva ao botão Voltar; Enter ou Escape fecha a janela.');
  }

  function close() {
    UI.closeSupport();
  }

  return { open, close };
})();

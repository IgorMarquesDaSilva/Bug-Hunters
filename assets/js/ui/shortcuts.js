/* Ajuda de teclado compartilhada pela barra lateral e pelo leitor do jogo. */
window.ShortcutHelp = (() => {
  const groups = [
    {
      title: 'Navegação e respostas',
      entries: [
        ['Tab', 'Ir ao próximo controle. Use Tab e Enter para navegar e escolher, uma tecla de cada vez.'],
        ['Enter', 'Acionar o botão focado ou escolher uma resposta. Nas associações, selecionar o item, ligar à resposta e confirmar.'],
        ['Tab e Enter', 'No jogo da memória, virar duas cartas. Se não forem um par, acionar Virar as cartas para continuar.'],
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
        ['Tab', 'Acessar Tutorial, Glossário, Atalhos e Configurações. Os apoios também ficam disponíveis nas perguntas; ao fechar, a atividade continua de onde parou.']
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
        ['L', 'Ativar ou desativar a narração do jogo.'],
        ['C', 'Ativar ou desativar o alto contraste.'],
        ['+ / =', 'Aumentar o tamanho da fonte.'],
        ['−', 'Diminuir o tamanho da fonte. Use a tecla de menos.'],
        ['Narrador + Espaço', 'Se usar o Narrador do Windows, sair do modo de varredura para mover o personagem no mapa.']
      ]
    }
  ];

  function render() {
    const content = document.getElementById('shortcuts-content');
    if (!content || content.childElementCount) return;
    groups.forEach(group => {
      const section = document.createElement('section');
      section.className = 'shortcuts-group';
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
    window.AccessibilitySystem?.speak?.('Atalhos do jogo. Use as setas para rolar a lista. Tab leva ao botão Voltar; Enter ou Escape fecha a janela.');
  }

  function close() {
    UI.closeSupport();
  }

  return { open, close };
})();

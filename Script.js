// Substitua esta URL pela URL do seu Apps Script Web App
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbyLyrmee6n7s5UaIPeut1pQMRXJ29vD1bLuCpkAJc5DkPuQCXThc6_aSqRahLXgqq3nYA/exec';

// Função para carregar e exibir apostas no index.html
document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.querySelector('#tabela-apostas tbody');
  const totalMenino = document.getElementById('total-menino');
  const totalMenina = document.getElementById('total-menina');

  if (tabela) {
    fetch(SHEET_API_URL)
      .then(res => res.json())
      .then(data => {
        let totalM = 0;
        let totalF = 0;

        data.forEach(item => {
          const tr = document.createElement('tr');

          // Coluna Nome
          const nomeTd = document.createElement('td');
          nomeTd.textContent = item.nome;
          nomeTd.style.color = item.status.toLowerCase() === 'pago' ? 'black' : 'gray';
          tr.appendChild(nomeTd);

          // Coluna Sexo
          const sexoTd = document.createElement('td');
          sexoTd.textContent = item.sexo;
          sexoTd.style.color = item.sexo.toLowerCase() === 'menino' ? 'blue' : 'hotpink';
          tr.appendChild(sexoTd);

          // Coluna Valor
          const valorTd = document.createElement('td');
          const valor = parseFloat(item.valor);
          let cifroes = '';
          if (valor <= 100) cifroes = '💲';
          else if (valor <= 250) cifroes = '💲💲';
          else if (valor <= 500) cifroes = '💲💲💲';
          else cifroes = '💲💲💲💲';
          valorTd.textContent = cifroes;
          tr.appendChild(valorTd);

          // Coluna Status
          const statusTd = document.createElement('td');
          statusTd.textContent = item.status;
          statusTd.style.color = item.status.toLowerCase() === 'pago' ? 'green' : 'orange';
          tr.appendChild(statusTd);

          tabela.appendChild(tr);

          if (item.status.toLowerCase() === 'pago') {
            if (item.sexo.toLowerCase() === 'menino') totalM += valor;
            else if (item.sexo.toLowerCase() === 'menina') totalF += valor;
          }
        });

        totalMenino.textContent = `R$ ${totalM.toFixed(2)}`;
        totalMenina.textContent = `R$ ${totalF.toFixed(2)}`;
      });
  }

  // Formulário de aposta (apostar.html)
  const form = document.getElementById('form-aposta');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const sexo = document.querySelector('input[name="sexo"]:checked').value;
      const valor = document.getElementById('valor').value;

      fetch(SHEET_API_URL, {
        method: 'POST',
        body: new URLSearchParams({ nome, sexo, valor }),
      })
        .then(res => res.text())
        .then(msg => {
          alert('Aposta registrada com sucesso!');
          window.location.href = 'index.html';
        })
        .catch(err => {
          alert('Erro ao registrar aposta.');
        });
    });
  }
});

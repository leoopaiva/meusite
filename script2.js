
const SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbyLyrmee6n7s5UaIPeut1pQMRXJ29vD1bLuCpkAJc5DkPuQCXThc6_aSqRahLXgqq3nYA/exec';

document.addEventListener('DOMContentLoaded', () => {
  const tabela = document.querySelector('#tabela-apostas tbody');
  const totalMenino = document.getElementById('total-menino');
  const totalMenina = document.getElementById('total-menina');
  const carregando = document.getElementById('carregando-apostas');

  if (tabela && carregando) {
    fetch(SHEET_API_URL)
      .then(res => res.json())
      .then(data => {
        let totalM = 0;
        let totalF = 0;

        data.forEach(item => {
          const tr = document.createElement('tr');

          const nomeTd = document.createElement('td');
          nomeTd.textContent = item.nome;
          nomeTd.style.color = item.status.toLowerCase() === 'pago' ? 'black' : 'gray';
          tr.appendChild(nomeTd);

          const sexoTd = document.createElement('td');
          sexoTd.textContent = item.sexo;
          sexoTd.style.color = item.sexo.toLowerCase() === 'menino' ? 'blue' : 'hotpink';
          tr.appendChild(sexoTd);

          const valorTd = document.createElement('td');
          const valor = parseFloat(item.valor);
          let cifroes = '';
          if (valor <= 100) cifroes = '💲';
          else if (valor <= 250) cifroes = '💲💲';
          else if (valor <= 500) cifroes = '💲💲💲';
          else cifroes = '💲💲💲💲';
          valorTd.textContent = cifroes;
          tr.appendChild(valorTd);

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
        carregando.style.display = 'none';
      })
      .catch(err => {
        carregando.textContent = 'Erro ao carregar apostas';
        carregando.style.color = 'red';
      });
  }
});

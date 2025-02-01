async function postEvent(event) {
  event.preventDefault();  // Evita que o formulário seja enviado de forma tradicional

  const eventosEndpoint = '/eventos';  // Endpoint onde os eventos são cadastrados
  const URLCompleta = `http://localhost:3005${eventosEndpoint}`;

  let nomeEventoInput = document.querySelector('#nome');
  let telefoneInput = document.querySelector('#telefone');
  let numeroInput = document.querySelector('#numero');
  let cepInput = document.querySelector('#cep');
  let valorInput = document.querySelector('#valor');
  let complementoInput = document.querySelector('#complemento');
  let categoriaInput = document.querySelector('#categoria');
  let qtdIngressoInput = document.querySelector('#qtd-ingresso');
  let bannerInput = document.querySelector('#banner');
  let descricaoInput = document.querySelector('#descricao');
  let enderecoInput = document.querySelector('#endereco');

  let nome = nomeEventoInput.value;
  let telefone = telefoneInput.value;
  let numero = numeroInput.value;
  let cep = cepInput.value;
  let url_logo = bannerInput.value;
  let preco = parseFloat(valorInput.value);
  let complemento = complementoInput.value;
  let ingresso = qtdIngressoInput.value;
  let descricao = descricaoInput.value;
  let endereco = enderecoInput.value;
  let categoria = categoriaInput.value;

  if (nome && telefone && categoria && descricao && url_logo && preco >= 0 && complemento && numero && ingresso && endereco && cep) {

      nomeEventoInput.value = "";
      telefoneInput.value = "";
      numeroInput.value = "";
      cepInput.value = "";
      bannerInput.value = "";
      valorInput.value = "";
      complementoInput.value = "";
      qtdIngressoInput.value = "";
      descricaoInput.value = "";
      enderecoInput.value = "";
      categoriaInput.value = "";

      try {
          const response = await axios.post(URLCompleta, {
              nome,
              telefone,
              numero,
              cep,
              url_logo,
              preco,
              complemento,
              ingresso,
              descricao,
              endereco,
              categoria
          });

          const eventos = response.data;

          exibirAlerta('.alert-evento', 'Evento cadastrado com sucesso', ['show', 'alert-success'], ['d-none'], 2000);

      } catch (error) {
          console.error(error);
          exibirAlerta('.alert-evento', 'Erro ao cadastrar evento', ['show', 'alert-danger'], ['d-none'], 2000);
      }

  } else {
      exibirAlerta('.alert-evento', 'Preencha todos os campos corretamente', ['show', 'alert-danger'], ['d-none'], 2000);
  }
}

function exibirAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
  let alert = document.querySelector(seletor);

  if (alert) {
      alert.innerHTML = innerHTML;
      alert.classList.add(...classesToAdd);
      alert.classList.remove(...classesToRemove);

      setTimeout(() => {
          alert.classList.remove('show');
          alert.classList.add('d-none');
      }, timeout);
  } else {
      console.error("Elemento de alerta não encontrado. Verifique o seletor:", seletor);
  }
}


document.getElementById('eventoForm').addEventListener('submit', postEvent);


const GEMINI_KEY = "AIzaSyBZlfyva_dGdPFIzPomwMccqV9OTX2J3Ck";

async function gerarDescricao(categoria) {
  try {
      const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
          {
              contents: [
                  {
                      role: "user",
                      parts: [
                          {
                              text: `Gere uma descrição criativa e chamativa para um evento da categoria "${categoria}". Não precisa utilizar caracteres especiais no texto, como #, **, etc`
                          }
                      ]
                  }
              ]
          },
          {
              headers: { "Content-Type": "application/json" }
          }
      );

      console.log("Resposta da API:", response.data);

      const descricaoGerada = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      return descricaoGerada || "Descrição não gerada";
  } catch (error) {
      console.error("Erro ao gerar descrição do evento:", error.response?.data || error.message);
      return "";
  }
}

async function ClickDescricao() {
  const categoria = document.getElementById("categoria").value;
  const descricao = document.getElementById("descricao");

  if (!categoria || !descricao) {
      alert("Preencha a categoria antes de gerar a descrição.");
      return;
  }

  descricao.value = "Gerando descrição..."; 
  const descricaoGerada = await gerarDescricao(categoria);
    
  if (descricaoGerada) {
      descricao.value = descricaoGerada;  
  } else {
      descricao.value = ""; 
      alert("Erro ao gerar descrição do evento. Tente novamente.");
  }
}

document.getElementById("btnGerarDescricao").addEventListener("click", ClickDescricao);

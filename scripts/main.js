// Importação do módulo de busca de cotações
import { getCurrentRate } from "./currentRate.js";

// Cotação de moedas do dia
const USD = await getCurrentRate("USD");
const EUR = await getCurrentRate("EUR");
const GBP = await getCurrentRate("GBP");

// Obtendo os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const footer = document.querySelector("main footer");
const description = document.getElementById("description");
const result = document.getElementById("result");
const timestamp = document.getElementById("timestamp");

// Manipulando o input 'amount' para aceitar somente números
amount.addEventListener("input", (event) => {  
  const hasCharactersRegex = /\D+/g;
  amount.value = amount.value.replace(hasCharactersRegex, "");
});

// Capturando o evento de submit (envio) do formulário
form.onsubmit = (event) => {
  event.preventDefault();

  switch(currency.value) {
    case "USD": 
      convertCurrency(Number(amount.value), Number(USD.rate), USD.rateTimestamp, "US$");
      break;
    case "EUR":
      convertCurrency(Number(amount.value), Number(EUR.rate), EUR.rateTimestamp, "€");
      break;
    case "GBP":
      convertCurrency(Number(amount.value), Number(GBP.rate), GBP.rateTimestamp, "£");
      break;
  }
}

/**
 * Converte valor em moeda estrangeira para real brasileiro e atualiza a 
 * informação na página HTML.
 * 
 * @param {number} amount - valor em moeda estrangeira a ser convertido 
 * @param {number} price - cotação atual, em reais, da moeda estrangeira
 * @param {string} rateTimestamp - data/hora da cotação atual
 * @param {string} symbol - símbolo da moeda estrangeira 
 */
function convertCurrency(amount, price, rateTimestamp, symbol) {
  try {
    description.textContent = `${symbol} 1 = ${formatCurrencyBRL(price, false)}`;
    let total = amount * price;

    if(isNaN(total)) {
      return alert("Por favor, digite o valor corretamente.");
    }

    total = formatCurrencyBRL(total, true).replace("R$", "");

    result.textContent = `${total} Reais`;
    timestamp.textContent = `Data/hora da cotação: ${formatTimestamp(rateTimestamp)}`;

    footer.classList.add("show-result");
  } catch (error) {
    footer.classList.remove("show-result");

    console.log(error);
    alert("Não possível converter este valor. Por favor, tente mais tarde ");
  }
}

/**
 * Formata o valor para real brasileiro
 * 
 * @param {number} value - valor a ser formatado
 * @param {boolean} round - indica se o valor deve ser arredondado para duas
 * casas decimais 
 * @returns {string} valor formatado em real brasileiro
 */
function formatCurrencyBRL(value, round) {
  let digits = 5;

  if (round) {
    digits = 2;
  }

  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  });
}

/**
 * Formata uma string com data/hora (timestamp) para o formato brasileiro.
 * 
 * @param {string} timestamp - data/hora a ser formatada 
 * @returns {string} data/hora com formato brasileiro
 */
function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString("pt-BR");
}
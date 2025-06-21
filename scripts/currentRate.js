/**
 * Formata uma data do tipo Date em uma data no formato aceito pela API de 
 * cotações (mm-dd-yyyy).
 * 
 * @param {Date} date - objeto do tipo Date
 * @returns {string} data no formato 'mm-dd-yyyy'
 */
function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear());

  return `${month}-${day}-${year}`;
}

/**
 * Retorna a data atual no formato 'mm-dd-yyyy'.
 * 
 * @returns {string} data atual no formato 'mm-dd-yyyy'
 */
function today() {
  const date = new Date();
  return formatDate(date);
}

/**
 * Retorna a cotação atual (com data/hora da cotação) de uma moeda estrangeira
 * 
 * @param {string} currencyCode - código da moeda no formato ISO 4217 
 * @returns {object} objeto com cotação atual e data/hora da cotação
 */
export async function getCurrentRate(currencyCode) {
  try {
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodoFechamento(codigoMoeda=@codigoMoeda,dataInicialCotacao=@dataInicialCotacao,dataFinalCotacao=@dataFinalCotacao)?@codigoMoeda='${currencyCode}'&@dataInicialCotacao='01-01-1970'&@dataFinalCotacao='${today()}'&$format=json&$select=cotacaoVenda,dataHoraCotacao`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error. Status ${response.status}.`);
    }

    const data = await response.json();
    const currentRate = {
      rate: data.value[0].cotacaoVenda,
      rateTimestamp: data.value[0].dataHoraCotacao
    }

    return currentRate;
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}
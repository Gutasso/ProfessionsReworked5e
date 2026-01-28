import { TABELA_DIFICULDADE, VALOR_ACERTOS, COZINHEIRO_CONFIG } from './constants.js';

/**
 * Determina qual o nível de sucesso atingido e quantos acertos ele gera.
 */
export function calcularResultado(total, dificuldade) {
    const limiares = TABELA_DIFICULDADE[dificuldade];
    
    if (!limiares) return { resultado: "GRANDE_FALHA", acertos: 0 };

    let resultado;

    if (total >= limiares.g_sucesso)      resultado = "GRANDE_SUCESSO";
    else if (total >= limiares.a_sucesso) resultado = "ALTO_SUCESSO";
    else if (total >= limiares.m_sucesso) resultado = "MEDIO_SUCESSO";
    else if (total >= limiares.sucesso)   resultado = "SUCESSO";
    else if (total >= limiares.b_sucesso) resultado = "BAIXO_SUCESSO";
    else if (total >= limiares.media)     resultado = "MEDIA";
    else if (total >= limiares.b_falha)   resultado = "BAIXA_FALHA";
    else if (total >= limiares.falha)     resultado = "FALHA";
    else if (total >= limiares.m_falha)   resultado = "MEDIA_FALHA";
    else if (total >= limiares.a_falha)   resultado = "ALTA_FALHA";
    else                                  resultado = "GRANDE_FALHA";

    return {
        resultado: resultado,
        acertos: VALOR_ACERTOS[resultado] || 0
    };
}

/**
 * Processa a rolagem do Cozinheiro.
 */
export function processarCozinheiro(total, tipoPreparo) {
    const config = COZINHEIRO_CONFIG[tipoPreparo];
    
    // Proteção caso o tipoPreparo venha errado do HTML
    if (!config) {
        console.error(`Profissões Dinâmicas | Tipo de preparo não encontrado: ${tipoPreparo}`);
        return { efeitoFinal: "Erro", resultadoMatematico: "FALHA" };
    }
    
    const base = calcularResultado(total, config.dificuldade);
    const efeito = config.resultados[base.resultado];

    return {
        preparo: tipoPreparo,
        dificuldadeUsada: config.dificuldade,
        resultadoMatematico: base.resultado,
        efeitoFinal: efeito
    };
}
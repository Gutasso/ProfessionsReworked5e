import { TABELA_DIFICULTADE, VALOR_ACERTOS, COZINHEIRO_CONFIG } from './constants.js';

/**
 * Determina qual o nível de sucesso atingido e quantos acertos ele gera.
 */
export function calcularResultado(total, dificuldade) {
    const limiares = TABELA_DIFICULTADE[dificuldade];
    
    if (!limiares) return { resultado: "GRANDE_FALHA", acertos: 0 };

    let resultado;

    // A cascata de comparação continua igual para definir a string do resultado
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

    // Agora é apenas uma busca simples:
    return {
        resultado: resultado,
        acertos: VALOR_ACERTOS[resultado] || 0
    };
};
export function processarCozinheiro(total, tipoPreparo) {
    const config = COZINHEIRO_CONFIG[tipoPreparo];
    
    // 1. A função busca automaticamente a dificuldade (Fácil, Médio ou Muito Difícil)
    const base = calcularResultado(total, config.dificuldade);
    
    // 2. Busca o resultado na tabela de strings (qualidade ou bônus)
    const efeito = config.resultados[base.resultado];

    return {
        preparo: tipoPreparo,
        dificuldadeUsada: config.dificuldade,
        resultadoMatematico: base.resultado, // Ex: "ALTO_SUCESSO"
        efeitoFinal: efeito,                 // Ex: "Aristocrat" ou "Bônus Maior"
    };
}
/**
 * Matriz de Dificuldade
 * Cada nível de dificuldade define os limiares para os 11 resultados possíveis.
 */
export const TABELA_DIFICULDADE = {
    "Muito Fácil":      { g_sucesso: 16, a_sucesso: 14, m_sucesso: 12, sucesso: 10, b_sucesso: 8, media: 6, b_falha: 4, falha: 3, m_falha: 1, a_falha: -2, g_falha: -3 },
    "Fácil":            { g_sucesso: 20, a_sucesso: 17, m_sucesso: 15, sucesso: 13, b_sucesso: 11, media: 9, b_falha: 7, falha: 5, m_falha: 4, a_falha: 2, g_falha: -1 },
    "Médio":            { g_sucesso: 25, a_sucesso: 22, m_sucesso: 19, sucesso: 17, b_sucesso: 15, media: 13, b_falha: 11, falha: 9, m_falha: 7, a_falha: 6, g_falha: 4 },
    "Difícil":          { g_sucesso: 32, a_sucesso: 28, m_sucesso: 25, sucesso: 22, b_sucesso: 20, media: 18, b_falha: 16, falha: 14, m_falha: 12, a_falha: 10, g_falha: 9 },
    "Muito Difícil":    { g_sucesso: 40, a_sucesso: 36, m_sucesso: 32, sucesso: 29, b_sucesso: 26, media: 24, b_falha: 22, falha: 20, m_falha: 18, a_falha: 16, g_falha: 14 },
    "Quase Impossível": { g_sucesso: 50, a_sucesso: 45, m_sucesso: 41, sucesso: 37, b_sucesso: 34, media: 31, b_falha: 29, falha: 27, m_falha: 25, a_falha: 23, g_falha: 21 }
};

/**
 * Conversão de Consequências em Acertos
 */
export const VALOR_ACERTOS = {
    "GRANDE_SUCESSO": 2,
    "ALTO_SUCESSO": 2,
    "MEDIO_SUCESSO": 1,
    "BAIXO_SUCESSO": 1,
    "MEDIA": 0.5,
    "BAIXA_FALHA": 0.5,
    "FALHA": 0.25,
    "MEDIA_FALHA": 0.25,
    "ALTA_FALHA": 0,
    "GRANDE_FALHA": 0
};
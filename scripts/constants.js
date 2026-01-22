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
    "SUCESSO": 1,
    "BAIXO_SUCESSO": 1,
    "MEDIA": 0.5,
    "BAIXA_FALHA": 0.5,
    "FALHA": 0.25,
    "MEDIA_FALHA": 0.25,
    "ALTA_FALHA": 0,
    "GRANDE_FALHA": 0
};
export const COZINHEIRO_CONFIG = {
    "BAIXA_QUALIDADE": {
        dificuldade: "Fácil",
        resultados: {
            "GRANDE_SUCESSO": "Comfortable",
            "ALTO_SUCESSO":   "Comfortable",
            "MEDIO_SUCESSO":  "Modest",
            "SUCESSO":        "Modest",
            "BAIXO_SUCESSO":  "Poor",
            "MEDIA":          "Poor",
            "BAIXA_FALHA":    "Poor",
            "FALHA":          "Poor",
            "MEDIA_FALHA":    "Poor",
            "ALTA_FALHA":     "Squalid",
            "GRANDE_FALHA":   "Squalid"
        }
    },
    "ALTA_QUALIDADE": {
        dificuldade: "Médio",
        resultados: {
            "GRANDE_SUCESSO": "Aristocrat",
            "ALTO_SUCESSO":   "Aristocrat",
            "MEDIO_SUCESSO":  "Wealthy",
            "SUCESSO":        "Wealthy",
            "BAIXO_SUCESSO":  "Comfortable",
            "MEDIA":          "Comfortable",
            "BAIXA_FALHA":    "Comfortable",
            "FALHA":          "Comfortable",
            "MEDIA_FALHA":    "Comfortable",
            "ALTA_FALHA":     "Modest",
            "GRANDE_FALHA":   "Modest"
        }
    },
    "BANQUETE": {
        dificuldade: "Muito Difícil",
        resultados: {
            "GRANDE_SUCESSO": "4d10 + @level",
            "ALTO_SUCESSO":   "4d10 + @level",
            "MEDIO_SUCESSO":  "3d10 + ceil(@level / 2)",
            "SUCESSO":        "3d10 + ceil(@level / 2)",
            "BAIXO_SUCESSO":  "3d10 + ceil(@level / 2)",
            "MEDIA":          "2d10 + ceil(@level / 2)",
            "BAIXA_FALHA":    "2d10 + ceil(@level / 2)",
            "FALHA":          "1d10 + ceil(@level / 2)",
            "MEDIA_FALHA":    "1d10 + ceil(@level / 2)",
            "ALTA_FALHA":     "0",
            "GRANDE_FALHA":   "0"
        }
    }
};
/**
 * Definição dos objetivos de projeto (Hits necessários)
 * Baseado na complexidade definida no seu sistema.
 */
export const COMPLEXIDADE_PROJETO = {
    "Simples": {
        acertosNecessarios: 2,
        descricao: "Um item básico ou reparo simples."
    },
    "Moderadamente Complexo": {
        acertosNecessarios: 4,
        descricao: "Um item de qualidade padrão ou trabalho detalhado."
    },
    "Complexo": {
        acertosNecessarios: 8,
        descricao: "Um item magistral ou estrutura técnica."
    },
    "Muito Complexo": {
        acertosNecessarios: 16,
        descricao: "Uma obra lendária ou engenharia avançada."
    }
};
import { calcularResultado, processarCozinheiro } from './logic.js';
import { COMPLEXIDADE_PROJETO, PROFISSOES_CONFIG, TREINAMENTO_CONFIG, TREINO_ATRIBUTO_RANGES, LANGUAGES_DATA, XP_VENENO_COLETA, XP_COZINHEIRO, ALQUIMISTA_POCAO, CARPINTEIRO_ARMA, COUREIRO_ARMADURA, COUREIRO_ARMA, FERREIRO_ARMADURA, FERREIRO_ARMA, ESCRIBA_PERGAMINHO, PREPARO_ENCANTAMENTO, HERBALISTA_BIOMAS, HERBALISTA_MATRIZ, HERBALISTA_META, JOALHEIRO_GEMA, JOALHEIRO_ENCRUSTAR, SICARIO_DRAGAO, SICARIO_COLETA_DIFF, SICARIO_DOSES, CARTOGRAFO_BIOMAS_LISTA, CARTOGRAFO_BIOMA_DIFF, CARTOGRAFO_RASCUNHO_INC } from './constants.js';

// --- CONFIGURAÇÃO VISUAL ---
const RESULTADO_FORMAT = {
    "GRANDE_SUCESSO": { label: "Grande Sucesso", color: "#006400", bg: "#edffed", border: "#006400" },
    "ALTO_SUCESSO":   { label: "Alto Sucesso",   color: "#006400", bg: "#edffed", border: "#006400" },
    "MEDIO_SUCESSO":  { label: "Médio Sucesso",  color: "#005a9c", bg: "#e6f2ff", border: "#005a9c" },
    "SUCESSO":        { label: "Sucesso",        color: "#005a9c", bg: "#e6f2ff", border: "#005a9c" },
    "BAIXO_SUCESSO":  { label: "Baixo Sucesso",  color: "#b8860b", bg: "#fff8e1", border: "#b8860b" },
    "MEDIA":          { label: "Média",          color: "#b8860b", bg: "#fff8e1", border: "#b8860b" },
    "BAIXA_FALHA":    { label: "Baixa Falha",    color: "#c0392b", bg: "#fadbd8", border: "#c0392b" },
    "FALHA":          { label: "Falha",          color: "#c0392b", bg: "#fadbd8", border: "#c0392b" },
    "MEDIA_FALHA":    { label: "Média Falha",    color: "#8b0000", bg: "#e6b0aa", border: "#8b0000" },
    "ALTA_FALHA":     { label: "Alta Falha",     color: "#555555", bg: "#dcdcdc", border: "#555555" },
    "GRANDE_FALHA":   { label: "Grande Falha",   color: "#000000", bg: "#cccccc", border: "#000000" }
};

// --- VARIÁVEL GLOBAL DE CONTROLE DE ABA ---
let tabParaManter = null;

const ICONES_PROFISSAO = {
    "Alquimista": "fa-flask", "Carpinteiro": "fa-tree", "Cartógrafo": "fa-map",
    "Cozinheiro": "fa-utensils", "Coureiro": "fa-vest", "Engenheiro": "fa-cog",
    "Escriba": "fa-feather", "Ferreiro": "fa-hammer", "Herbalista": "fa-leaf",
    "Joalheiro": "fa-gem", "Oleiro": "fa-wine-bottle", "Pedreiro": "fa-monument",
    "Sicário": "fa-skull-crossbones", "Tecelão": "fa-mitten"
};

const ATRIBUTOS = {
    "str": "Força", "dex": "Destreza", "con": "Constituição", 
    "int": "Inteligência", "wis": "Sabedoria", "cha": "Carisma"
};

Hooks.once("init", () => {
    console.log("Profissões Dinâmicas | Inicializando sistema...");
});

// --- FUNÇÕES DE DROPDOWN (UI) ---
function atualizarDropdownAlquimista(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity');if(!s.length)return;const v=s.val();if(v==="Item de Aventureiro"){x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}else if(v==="Poção"){let o='';for(const[r,k]of Object.entries(ALQUIMISTA_POCAO))o+=`<option value="${r}">${r}</option>`;x.html(o);x.prop('disabled',false)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`);x.prop('disabled',false)}}
function atualizarDropdownCarpinteiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);if(v==="Item de Aventureiro"){x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}else if(v==="Escudo"){x.html('<option value="Moderadamente Complexo">Moderado</option>');x.prop('disabled',true)}else if(v==="Arma de Madeira"){let o='';for(const[t,k]of Object.entries(CARPINTEIRO_ARMA))o+=`<option value="${t}">${t}</option>`;x.html(o)}else if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownCoureiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);if(v==="Item de Aventureiro"){x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}else if(v==="Armadura de Couro"){let o='';for(const[t,k]of Object.entries(COUREIRO_ARMADURA))o+=`<option value="${t}">${t}</option>`;x.html(o)}else if(v==="Arma de Couro"){let o='';for(const[t,k]of Object.entries(COUREIRO_ARMA))o+=`<option value="${t}">${t}</option>`;x.html(o)}else if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownEngenheiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownEscriba(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);if(v==="Pergaminho de Magia"){let o='';for(const[k,v]of Object.entries(ESCRIBA_PERGAMINHO))o+=`<option value="${k}">${k}</option>`;x.html(o)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownFerreiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity'),p=c.find('.plate-toggle-container');if(!s.length)return;const v=s.val();r.hide();p.hide();x.prop('disabled',false);if(v==="Item de Aventureiro"){x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}else if(v==="Armadura de Metal"){let o='';for(const[t,k]of Object.entries(FERREIRO_ARMADURA))o+=`<option value="${t}">${t}</option>`;x.html(o)}else if(v==="Arma de Metal"){let o='';for(const[t,k]of Object.entries(FERREIRO_ARMA))o+=`<option value="${t}">${t}</option>`;x.html(o)}else if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}

// --- CORREÇÃO AQUI: Função do Herbalista Limpa ---
function atualizarDropdownHerbalista(c){
    const s=c.find('.new-project-subtype');
    const x=c.find('.new-project-complexity');
    const r=c.find('.new-project-rarity');
    // Dropdown de bioma removido da criação
    
    if(!s.length) return;
    const v=s.val();
    
    r.hide();
    x.hide(); // Herbalista oculta complexidade manual

    if(v==="Tintura Mágica"){
        r.show();
    } 
}

function atualizarDropdownJoalheiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),gr=c.find('.new-project-gem-rarity'),vi=c.find('.new-project-value'),ger=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();gr.hide();vi.hide();ger.hide();x.prop('disabled',false);x.show();if(v==="Gema Lapidada"){gr.show();vi.show();x.hide()}else if(v==="Encrustar Gemas para Encantamento"){ger.show();x.html('<option value="Complexo">Complexo</option>');x.prop('disabled',true)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownOleiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);x.show();if(v==="Item de Aventureiro de Argila"){x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option>`)}else if(v==="Item de Aventureiro de Vidro"){x.html(`<option value="Simples">Simples</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}else if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownPedreiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownSicario(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),da=c.find('.new-project-dragon-age'),pt=c.find('.new-project-poison-type'),ht=c.find('.new-project-herb-type');if(!s.length)return;const v=s.val();da.hide();pt.hide();ht.hide();x.show();x.prop('disabled',false);if(v==="Veneno Básico"){x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}else if(v==="Veneno Avançado"){x.html('<option value="Moderadamente Complexo">Moderado</option>');x.prop('disabled',true)}else if(v==="Coleta de Veneno de Monstro"){pt.show();x.hide()}else if(v==="Coleta de Erva Venenosa"){ht.show();x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}}
function atualizarDropdownTecelao(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);x.show();if(v==="Item de Aventureiro"){x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}else if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownCartografo(container) {const subTipoSelect = container.find('.new-project-subtype');const complexidadeSelect = container.find('.new-project-complexity');if (!subTipoSelect.length) return;const valorAtual = subTipoSelect.val();complexidadeSelect.prop('disabled', false);complexidadeSelect.show();if (valorAtual === "Cópia de Mapa") {complexidadeSelect.html('<option value="Moderadamente Complexo">Moderado</option>');complexidadeSelect.prop('disabled', true);} else if (valorAtual === "Desenho de Mapa") {complexidadeSelect.hide();}}

Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
    const actor = app.actor;

    const salvarScroll = () => {
        // Memoriza qual aba está ativa NESTE MOMENTO
        tabParaManter = app._tabs[0].active;
        
        app._scrollInfo = null; 
        const sheetBody = app.element.find('.sheet-body');
        if (sheetBody.length && sheetBody.scrollTop() > 0) {
            app._scrollInfo = { selector: '.sheet-body', pos: sheetBody.scrollTop() };
            return;
        }
        const candidatos = app.element.find('.professions-tab, .window-content, form, .tab.active');
        candidatos.each((i, el) => {
            if (el.scrollTop > 0) {
                let selector = el.tagName.toLowerCase();
                if (el.className) selector += `.${el.className.split(' ').join('.')}`;
                app._scrollInfo = { selector: selector, pos: el.scrollTop };
                return false;
            }
        });
    };

    // 1. DADOS
    let cookParams = actor.getFlag("professions-reworked-5e", "cookParams") || {};
    const defaultCook = { atributoPadrao: "wis", usoVantagem: false, usoDesvantagem: false, bonusSituacional: "" };
    cookParams = foundry.utils.mergeObject(defaultCook, cookParams);

    let profissoesAtivas = actor.getFlag("professions-reworked-5e", "profissoesAtivas") || [];
    let listaProjetos = actor.getFlag("professions-reworked-5e", "projetos") || [];
    let colapsos = actor.getFlag("professions-reworked-5e", "colapsos") || {};
    let ferramentasEquipadas = actor.getFlag("professions-reworked-5e", "ferramentasEquipadas") || {};
    let refeicoesProntas = actor.getFlag("professions-reworked-5e", "refeicoesProntas") || [];
    let treinosAtivos = actor.getFlag("professions-reworked-5e", "treinosAtivos") || [];
    let treinosColapsos = actor.getFlag("professions-reworked-5e", "treinosColapsos") || {};
    let listaTreinamentos = actor.getFlag("professions-reworked-5e", "listaTreinamentos") || [];

    // --- PREPARAÇÃO DE DADOS DE PERÍCIA ---
    // Filtra skills que NÃO são Expertise (valor 2). 0 = Sem prof, 1 = Proficiente.
    const skillsDisponiveis = Object.entries(actor.system.skills)
        .filter(([key, skill]) => skill.value < 2)
        .map(([key, skill]) => ({
            key: key,
            label: CONFIG.DND5E.skills[key]?.label || key // Pega o nome traduzido do sistema
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    // --- PREPARAÇÃO DE DADOS DE RESISTÊNCIA ---
    // Filtra atributos onde o jogador NÃO tem proficiência no Save (0)
    const savesDisponiveis = Object.entries(actor.system.abilities)
        .filter(([key, ability]) => ability.proficient === 0)
        .map(([key, ability]) => ({
            key: key,
            label: ATRIBUTOS[key] // Usa a constante de tradução
        }));

    // --- PREPARAÇÃO DE DADOS DE PROFISSÃO PARA TREINO ---
    // Filtra ferramentas que o jogador tem proficiência mas NÃO tem Expertise (< 2)
    // E que sejam suportadas pelo nosso sistema (existem em PROFISSOES_CONFIG)
    const profissoesDisponiveisTreino = [];
    
    // Varre os itens do ator procurando ferramentas
    actor.items.forEach(item => {
        if (item.type === "tool") {
            const baseItem = item.system.type?.baseItem;
            const multiplier = item.system.prof?.multiplier || 0;
            
            // Se não tem expertise (mult < 2)
            if (multiplier < 2) {
                // Tenta achar qual profissão usa essa ferramenta
                for (const [nomeProf, config] of Object.entries(PROFISSOES_CONFIG)) {
                    if (config.ferramenta === baseItem) {
                        // Evita duplicatas se tiver 2 kits iguais
                        if (!profissoesDisponiveisTreino.find(p => p.nome === nomeProf)) {
                            profissoesDisponiveisTreino.push({ nome: nomeProf });
                        }
                    }
                }
            }
        }
    });
    profissoesDisponiveisTreino.sort((a, b) => a.nome.localeCompare(b.nome));
    
    const linguasConhecidasDoAtor = new Set(actor.system.traits.languages.value.map(l => l.toLowerCase()));
    const mapaSistema = {"thieve's cant": "cant", "deep speech": "deep"};
    const idiomasDisponiveis = Object.keys(LANGUAGES_DATA).filter(langName => {
        const langKey = langName.toLowerCase();
        // Verifica se o ator tem a lingua (usando chave direta ou mapeada)
        const systemKey = mapaSistema[langKey] || langKey;
        return !linguasConhecidasDoAtor.has(systemKey);
    }).sort();


    const listaAtributos = Object.entries(ATRIBUTOS).map(([k, v]) => ({ value: k, label: v }));

    // 2. MAPEAR PROFISSÕES
    const profissoesRender = profissoesAtivas.map(pName => {
        const config = PROFISSOES_CONFIG[pName];
        const baseTool = config ? config.ferramenta : "";
        const ferramentasNoInventario = actor.items
            .filter(i => i.type === "tool" && i.system.type.baseItem === baseTool)
            .map(i => ({ id: i.id, name: i.name, selected: ferramentasEquipadas[pName] === i.id }));

        // VERIFICAÇÃO DE TREINAMENTO ATIVO
        // Existe algum treino dessa profissão em andamento?
        const treinoAtivo = listaTreinamentos.find(t => 
            t.categoria === "Profissão" && 
            t.profissaoAlvo === pName && 
            t.acertosAtuais < t.totalNecessario
        );

        // Processar Refeições (Cozinheiro) COM TIMESTAMP
        const refeicoesProcessadas = (pName === "Cozinheiro") ? refeicoesProntas.map((ref, idx) => {
            // Verifica se a refeição foi criada DEPOIS que o treino começou
            const isCronologiaValida = treinoAtivo && ref.timestamp && (ref.timestamp > (treinoAtivo.timestamp || 0));
            
            return {
                ...ref,
                _index: idx,
                podeGanharXP: (isCronologiaValida && !ref.xpColetado)
            };
        }) : [];

        return {
            nome: pName,
            icon: ICONES_PROFISSAO[pName] || "fa-briefcase",
            isCozinheiro: pName === "Cozinheiro",
            isCollapsed: colapsos[pName] || false,
            
            cookParams: cookParams,
            refeicoes: refeicoesProcessadas,
            atributosLocais: listaAtributos,

            subTipos: config ? config.subTipos : [],
            ferramentasDisponiveis: ferramentasNoInventario,
            projetos: listaProjetos
                .map((proj, index) => ({ ...proj, _index: index }))
                .filter(proj => proj.profissao === pName)
                .map(proj => {
                    const comp = COMPLEXIDADE_PROJETO[proj.complexidade];
                    let infoExtra = "";
                    let exibirValor = false;
                    let isQuebrada = false;
                    let totalNecessario = comp ? comp.acertosNecessarios : 0;
                    let isColeta = (proj.subTipo === "Coleta de Veneno de Monstro");
                    let resultadoColeta = proj.resultadoColeta || null;
                    let isRascunho = (proj.profissao === "Cartógrafo" && proj.fase === "rascunho");
                    let isDesenhoDefinitivo = (proj.profissao === "Cartógrafo" && proj.fase === "definitivo");
                    let isHerbalista = (proj.profissao === "Herbalista"); // NOVO: Flag para Herbalista

                    if (proj.profissao === "Alquimista" && proj.subTipo === "Poção" && proj.raridade) {
                        const diffDisplay = proj.dificuldadeEspecifica || comp.dificuldade;
                        infoExtra = ` (${proj.raridade} - ${diffDisplay} - ${proj.complexidade})`;
                    }
                    if (proj.subTipo === "Arma de Madeira" && proj.tipoArma) { infoExtra = ` (${proj.tipoArma} - ${proj.dificuldadeEspecifica || comp.dificuldade} - ${proj.complexidade})`; }
                    if (proj.subTipo === "Armadura de Couro" && proj.tipoArmadura) { infoExtra = ` (${proj.tipoArmadura} - ${proj.dificuldadeEspecifica || comp.dificuldade} - ${proj.complexidade})`; }
                    if (proj.subTipo === "Arma de Couro" && proj.tipoArma) { infoExtra = ` (${proj.tipoArma} - ${proj.dificuldadeEspecifica || comp.dificuldade} - ${proj.complexidade})`; }
                    if (proj.profissao === "Escriba" && proj.subTipo === "Pergaminho de Magia" && proj.raridade) {
                        const diffDisplay = proj.dificuldadeEspecifica || comp.dificuldade;
                        infoExtra = ` (${proj.raridade} - ${diffDisplay} - ${proj.complexidade})`;
                    }
                    if (proj.profissao === "Ferreiro") {
                        if (proj.subTipo === "Arma de Metal" && proj.tipoArma) { infoExtra = ` (${proj.tipoArma} - ${proj.dificuldadeEspecifica || comp.dificuldade} - ${proj.complexidade})`; }
                        if (proj.subTipo === "Armadura de Metal" && proj.tipoArmadura) { infoExtra = ` (${proj.tipoArmadura} - ${proj.dificuldadeEspecifica || comp.dificuldade} - ${proj.complexidade})`; }
                    }
                    if (proj.subTipo === "Preparo para Encantamento" && proj.raridade) {
                         infoExtra = ` (Preparo: ${proj.raridade} / Base ${proj.complexidade})`;
                         if (proj.acertosTotaisPreparo) totalNecessario = proj.acertosTotaisPreparo;
                    }
                    if (proj.subTipo === "Conserto" || proj.subTipo === "Mecanismo Improvisado") {
                        if (proj.acertosTotaisPreparo) totalNecessario = proj.acertosTotaisPreparo;
                        const labelTipo = proj.subTipo === "Conserto" ? "Conserto" : "Improvisado";
                        infoExtra = ` (${labelTipo} - ${proj.complexidade})`;
                    }
                    // CORREÇÃO: Lógica Herbalista para ler do card
                    if (proj.profissao === "Herbalista") {
                        const diffDisplay = proj.dificuldadeEspecifica || "Selecione Bioma";
                        if (proj.raridade) {
                            infoExtra = ` (${proj.raridade} - ${proj.bioma || "?"} - ${diffDisplay})`;
                        } else {
                            infoExtra = ` (${proj.bioma || "?"} - ${diffDisplay})`;
                        }
                    }
                    if (proj.profissao === "Joalheiro") {
                        if (proj.subTipo === "Gema Lapidada") {
                            const diffDisplay = proj.dificuldadeEspecifica || comp.dificuldade;
                            infoExtra = ` (${proj.raridade} - ${diffDisplay} - ${proj.complexidade})`;
                            exibirValor = true;
                            if (proj.valorAtual !== undefined && proj.valorAtual <= 0) { isQuebrada = true; }
                        }
                        if (proj.subTipo === "Encrustar Gemas para Encantamento" && proj.raridade) {
                            const diffDisplay = proj.dificuldadeEspecifica || comp.dificuldade;
                            infoExtra = ` (${proj.raridade} - ${diffDisplay} - ${proj.complexidade})`;
                        }
                    }
                    if (proj.profissao === "Sicário") {
                        if (proj.subTipo === "Coleta de Veneno de Monstro") {
                            infoExtra = ` (${proj.tipoVenenoColeta} - ${proj.dificuldadeEspecifica})`;
                        }
                        if (proj.subTipo === "Coleta de Erva Venenosa") {
                            const diffDisplay = proj.dificuldadeEspecifica || comp.dificuldade;
                            infoExtra = ` (${proj.tipoErva} - ${diffDisplay} - ${proj.complexidade})`;
                        }
                    }
                    if (proj.profissao === "Cartógrafo" && proj.subTipo === "Desenho de Mapa") {
                        if (isRascunho) {
                            totalNecessario = proj.totalNecessario || 0;
                            infoExtra = " (Rascunho)";
                        } else if (isDesenhoDefinitivo) {
                            totalNecessario = proj.totalNecessario || 0;
                            infoExtra = " (Desenho Definitivo)";
                        }
                    }

                    if (!proj.atributoPadrao) proj.atributoPadrao = "int";

                    const isConcluido = proj.isConcluido || (!isRascunho && !isColeta && proj.acertosAtuais >= totalNecessario);

                    // --- LÓGICA DE FILTRO DE BIOMAS (NOVO) ---
                    let listaBiomasDinamica = [];

                    if (isRascunho) {
                        listaBiomasDinamica = CARTOGRAFO_BIOMAS_LISTA; 
                    } 
                    else if (isHerbalista) {
                        const sub = proj.subTipo;
                        const rar = proj.raridade;
                        let chaveMatriz = "padrao";

                        if (sub === "Erva de Poção") {
                            chaveMatriz = "uva";
                        } 
                        else if (sub === "Tintura Mágica") {
                            if (rar === "Comum") chaveMatriz = "comum";
                            else if (rar === "Incomum") chaveMatriz = "incomum";
                            else if (rar === "Raro") chaveMatriz = "raro";
                            else if (rar === "Muito Raro") chaveMatriz = "muito_raro";
                            else if (rar === "Lendário") chaveMatriz = "lendario";
                        }
                        
                        // Filtra apenas os biomas válidos (não nulos)
                        if (HERBALISTA_MATRIZ[chaveMatriz]) {
                            const matrizAlvo = HERBALISTA_MATRIZ[chaveMatriz];
                            listaBiomasDinamica = Object.keys(matrizAlvo).filter(bioma => matrizAlvo[bioma] !== null);
                        } else {
                            listaBiomasDinamica = HERBALISTA_BIOMAS; // Fallback
                        }
                    }

                    // LÓGICA DE BOTÃO XP (PROJETO)
                    let podeGanharXP = false;
                    
                    // A regra agora é: O projeto foi CONCLUÍDO depois que o treino começou?
                    // Usamos 'dataConclusao' (novo) em vez de 'timestamp' (criação).
                    const momentoConclusao = proj.dataConclusao || 0;
                    const momentoInicioTreino = treinoAtivo ? (treinoAtivo.timestamp || 0) : 0;

                    const isCronologiaValida = treinoAtivo && momentoConclusao > momentoInicioTreino;

                    if (isConcluido && !proj.xpColetado && isCronologiaValida) {
                        if (isColeta && proj.subTipo === "Coleta de Veneno de Monstro") {
                            if (proj.resultadoColeta && !proj.resultadoColeta.includes("Nenhuma dose")) {
                                podeGanharXP = true;
                            }
                        } else {
                            podeGanharXP = true;
                        }
                    }

                    return {
                        ...proj,
                        atributosLocais: listaAtributos,
                        infoExtra: infoExtra,
                        totalNecessario: totalNecessario,
                        porcentagem: isColeta ? 0 : (totalNecessario > 0 ? Math.min((proj.acertosAtuais / totalNecessario) * 100, 100) : 0),
                        exibirValor: exibirValor,
                        isQuebrada: isQuebrada,
                        isConcluido: isConcluido,
                        isColeta: isColeta,
                        resultadoColeta: resultadoColeta,
                        isRascunho: isRascunho,
                        isDesenhoDefinitivo: isDesenhoDefinitivo,
                        isHerbalista: isHerbalista,
                        listaBiomas: listaBiomasDinamica, // LISTA FILTRADA
                        usoDesvantagem: proj.usoDesvantagem || false,
                        podeGanharXP: podeGanharXP
                    };
                })
        };
    });

    // 3. MAPEAR TREINAMENTOS
    const treinosRender = treinosAtivos.map(tKey => {
        const config = TREINAMENTO_CONFIG[tKey] || { label: tKey, icon: "fa-question" };
        
        // Filtra os treinamentos que pertencem a esta categoria (ex: "Perícia")
        const listaDaCategoria = listaTreinamentos
            .map((treino, index) => ({ ...treino, _index: index }))
            .filter(treino => treino.categoria === tKey)
            .map(treino => {
                const totalNecessario = treino.totalNecessario || 50;
                const isConcluido = treino.acertosAtuais >= totalNecessario;
                if (!treino.atributoPadrao) treino.atributoPadrao = "str";
                
                return {
                    ...treino,
                    totalNecessario: totalNecessario,
                    porcentagem: (totalNecessario > 0 ? Math.min((treino.acertosAtuais / totalNecessario) * 100, 100) : 0),
                    isConcluido: isConcluido,
                    atributosLocais: listaAtributos
                };
            });

        return {
            nome: tKey,
            label: config.label,
            icon: config.icon,
            isCollapsed: treinosColapsos[tKey] || false,
            treinos: listaDaCategoria
        };
    });

    const templatePath = "modules/professions-reworked-5e/templates/professions-tab.hbs";
    const myTabHtml = await renderTemplate(templatePath, { 
        profissoesAtivas: profissoesRender,
        todasProfissoes: Object.keys(PROFISSOES_CONFIG)
    });

    const trainingTemplatePath = "modules/professions-reworked-5e/templates/training-tab.hbs";
    const trainingHtml = await renderTemplate(trainingTemplatePath, {
        treinamentosAtivos: treinosRender,
        opcoesTreino: Object.keys(TREINAMENTO_CONFIG),
        skillsDisponiveis: skillsDisponiveis,
        atributosDisponiveis: listaAtributos,
        savesDisponiveis: savesDisponiveis,
        idiomasDisponiveis: idiomasDisponiveis,
        profissoesDisponiveisTreino: profissoesDisponiveisTreino
    });

    const tabs = html.find('.sheet-navigation.tabs');
    if (tabs.find('[data-tab="professions"]').length === 0) {
        tabs.append($('<a class="item" data-tab="professions">Profissões</a>'));
    }
    if (tabs.find('[data-tab="training"]').length === 0) {
        tabs.append($('<a class="item" data-tab="training">Treinamento</a>'));
    }
    
    html.find('.professions-tab').remove();
    html.find('.training-tab').remove();
    
    const sheetBody = html.find('.sheet-body'); 
    
    sheetBody.append($(myTabHtml));
    sheetBody.append($(trainingHtml));

    html.find('.profession-section').each((i, el) => {
        const prof = $(el).data('prof');
        const form = $(el).find('.project-creation-form');
        if (prof === "Alquimista") atualizarDropdownAlquimista(form);
        if (prof === "Carpinteiro") atualizarDropdownCarpinteiro(form);
        if (prof === "Coureiro") atualizarDropdownCoureiro(form);
        if (prof === "Engenheiro") atualizarDropdownEngenheiro(form);
        if (prof === "Escriba") atualizarDropdownEscriba(form);
        if (prof === "Ferreiro") atualizarDropdownFerreiro(form);
        if (prof === "Herbalista") atualizarDropdownHerbalista(form);
        if (prof === "Joalheiro") atualizarDropdownJoalheiro(form);
        if (prof === "Oleiro") atualizarDropdownOleiro(form);
        if (prof === "Pedreiro") atualizarDropdownPedreiro(form);
        if (prof === "Sicário") atualizarDropdownSicario(form);
        if (prof === "Tecelão") atualizarDropdownTecelao(form);
        if (prof === "Cartógrafo") atualizarDropdownCartografo(form);
    });

    // --- NOVA LÓGICA DE ABA ATIVA E SCROLL ---
    if (tabParaManter) {
        if (tabParaManter === "professions" || tabParaManter === "training") {
            app._tabs[0].activate(tabParaManter);
            if (app._scrollInfo && app._scrollInfo.pos > 0) {
                let target = app.element.find(app._scrollInfo.selector);
                if (!target.length) target = app.element.find('.sheet-body');
                if (target.length) {
                    target.scrollTop(app._scrollInfo.pos);
                    requestAnimationFrame(() => target.scrollTop(app._scrollInfo.pos));
                }
            }
        }
        tabParaManter = null;
    } 
    else {
        const activeTab = app._tabs[0].active;
        if (activeTab === "professions" || activeTab === "training") {
            app._tabs[0].activate(activeTab);
        }
    }

    // --- EVENTOS ---

    // CORREÇÃO: Listener para mudança de Bioma (Herbalista e Cartógrafo)
    html.find('.card-biome-select').change(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        const novoBioma = ev.currentTarget.value;
        
        if (listaProjetos[index]) {
            listaProjetos[index].bioma = novoBioma;

            // LÓGICA NOVA PARA HERBALISTA: Recalcula dificuldade
            if (listaProjetos[index].profissao === "Herbalista") {
                const sub = listaProjetos[index].subTipo;
                const rar = listaProjetos[index].raridade;
                let chaveMatriz = "padrao";

                if (sub === "Erva de Poção") chaveMatriz = "uva";
                else if (sub === "Tintura Mágica") {
                    if (rar === "Comum") chaveMatriz = "comum";
                    else if (rar === "Incomum") chaveMatriz = "incomum";
                    else if (rar === "Raro") chaveMatriz = "raro";
                    else if (rar === "Muito Raro") chaveMatriz = "muito_raro";
                    else if (rar === "Lendário") chaveMatriz = "lendario";
                }

                const novaDiff = HERBALISTA_MATRIZ[chaveMatriz][novoBioma];
                
                if (!novaDiff) {
                    ui.notifications.warn(`Não é possível encontrar ${sub} em ${novoBioma}!`);
                    listaProjetos[index].bioma = ""; 
                    listaProjetos[index].dificuldadeEspecifica = "Bioma Inválido";
                } else {
                    listaProjetos[index].dificuldadeEspecifica = novaDiff;
                }
            }

            await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);
        }
    });

    html.find('.finish-draft-btn').click(async (ev) => {
        ev.stopPropagation();
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        const confirm = await Dialog.confirm({ title: "Finalizar Rascunho", content: `<p>Deseja Finalizar o Rascunho e Iniciar o Desenho Definitivo?</p>` });
        if (confirm) {
            if (listaProjetos[index]) {
                listaProjetos[index].fase = "definitivo";
                listaProjetos[index].acertosAtuais = 0; 
            }
            await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);
        } else { tabParaManter = null; } 
    });

    html.find('.add-training-btn').click(async (ev) => {
        salvarScroll();
        const novoTreino = html.find('.select-new-training').val();
        if (!treinosAtivos.includes(novoTreino)) {
            treinosAtivos.push(novoTreino);
            await actor.setFlag("professions-reworked-5e", "treinosAtivos", treinosAtivos);
        }
    });
    html.find('.remove-training').click(async (ev) => {
        ev.stopPropagation();
        salvarScroll();
        const type = ev.currentTarget.closest('.training-section').dataset.type;
        const confirm = await Dialog.confirm({ title: "Remover", content: `<p>Parar o <strong>${type}</strong>?</p>` });
        if (confirm) {
            const novosTreinos = treinosAtivos.filter(t => t !== type);
            await actor.setFlag("professions-reworked-5e", "treinosAtivos", novosTreinos);
        } else {
            tabParaManter = null;
        }
    });
    // Colapsar Categoria
    html.find('.training-header').click(async (ev) => {
        if ($(ev.target).closest('.remove-training').length) return;
        salvarScroll();
        const type = ev.currentTarget.closest('.training-section').dataset.type;
        treinosColapsos[type] = !treinosColapsos[type];
        await actor.setFlag("professions-reworked-5e", "treinosColapsos", treinosColapsos);
    });

    html.find('.new-project-herb-type').change(ev => {
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const val = $(ev.currentTarget).val();
        const compSelect = container.find('.new-project-complexity');
        if (val === "Veneno Básico") { compSelect.html('<option value="Simples">Simples</option>'); } 
        else if (val === "Veneno Avançado") { compSelect.html('<option value="Moderadamente Complexo">Moderado</option>'); }
    });
    html.find('.new-project-rarity').change(ev => {
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const profSection = container.closest('.profession-section');
        if (profSection.data('prof') === "Herbalista") { atualizarDropdownHerbalista(container); }
    });
    html.find('.new-project-complexity').change(ev => {
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const profSection = container.closest('.profession-section');
        if (profSection.data('prof') === "Ferreiro") {
            const val = $(ev.currentTarget).val();
            const plateToggle = container.find('.plate-toggle-container');
            if (val === "Armadura Pesada") { plateToggle.show(); plateToggle.css('display', 'flex'); } else { plateToggle.hide(); }
        }
    });
    html.find('.cook-attribute').change(async (ev) => { salvarScroll(); cookParams.atributoPadrao = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "cookParams", cookParams); });
    
    html.find('.cook-adv-checkbox').change(async (ev) => { 
        salvarScroll(); 
        cookParams.usoVantagem = ev.currentTarget.checked; 
        await actor.setFlag("professions-reworked-5e", "cookParams", cookParams); 
    });
    
    html.find('.cook-disadv-checkbox').change(async (ev) => {
        salvarScroll();
        cookParams.usoDesvantagem = ev.currentTarget.checked;
        await actor.setFlag("professions-reworked-5e", "cookParams", cookParams);
    });
    
    html.find('.cook-bonus').change(async (ev) => { salvarScroll(); cookParams.bonusSituacional = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "cookParams", cookParams); });
    html.find('.delete-meal').click(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.meal-card'); const index = card.dataset.index; if (index !== undefined) { refeicoesProntas.splice(index, 1); await actor.setFlag("professions-reworked-5e", "refeicoesProntas", refeicoesProntas); } });
    
    // --- LÓGICA DE ROLAGEM DO COZINHEIRO ---
    html.find('.cook-test').click(async (ev) => {
        salvarScroll(); 
        const tipo = ev.currentTarget.dataset.type; 
        const profName = "Cozinheiro"; 
        
        const attributeKey = cookParams.atributoPadrao || "wis"; 
        const hasAdvantage = cookParams.usoVantagem || false; 
        const hasDisadvantage = cookParams.usoDesvantagem || false; 
        const situationalBonus = cookParams.bonusSituacional || ""; 
        
        const toolId = ferramentasEquipadas[profName] || ""; 
        const hasTool = toolId !== ""; 
        const attrMod = actor.system.abilities[attributeKey].mod; 
        const attrLabel = ATRIBUTOS[attributeKey]; 
        
        let profBonus = 0; 
        let toolLabel = "Sem Ferramenta"; 
        
        if (hasTool) { 
            const toolItem = actor.items.get(toolId); 
            if (toolItem) { 
                toolLabel = toolItem.name; 
                const profMultiplier = toolItem.system.prof?.multiplier || 0; 
                profBonus = Math.floor(actor.system.attributes.prof * profMultiplier); 
            } 
        } 
        
        let diceFormula = "1d20";

        if (hasTool && hasAdvantage && !hasDisadvantage) {
            diceFormula = "2d20kh1"; 
        } 
        else if (!hasAdvantage && (hasDisadvantage || !hasTool)) {
            diceFormula = "2d20kl1"; 
        } 
        else {
            diceFormula = "1d20"; 
        }

        let formula = `${diceFormula} + ${attrMod}[${attrLabel}]`; 
        if (profBonus > 0) formula += ` + ${profBonus}[Prof]`; 
        if (situationalBonus) formula += ` + ${situationalBonus}[Sit]`;
        
        try { 
            const r = new Roll(formula, actor.getRollData()); 
            await r.evaluate(); 
            const resCozinha = processarCozinheiro(r.total, tipo); 
            let resultadoTexto = resCozinha.efeitoFinal; 
            
            if (tipo === "BANQUETE" && resultadoTexto !== "0") { 
                if (resultadoTexto.includes("d")) { 
                    try { 
                        const level = actor.system.details?.cr || actor.system.details?.level || 1; 
                        const rollPV = new Roll(resultadoTexto, { level: level }); 
                        await rollPV.evaluate(); 
                        resultadoTexto = `<strong>${rollPV.total} PV Temporários!</strong>`; 
                    } catch (innerErr) { 
                        console.error("Erro interno no Banquete:", innerErr); 
                        resultadoTexto += " (Erro calc.)"; 
                    } 
                } 
            } 

            const cfg = RESULTADO_FORMAT[resCozinha.resultadoMatematico] || { label: resCozinha.resultadoMatematico, color: "black", bg: "#eee", border: "#ccc" };
            const tipoLegivel = tipo.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());

            const contentHTML = `
                <div style="border: 2px solid ${cfg.border}; background-color: ${cfg.bg}; padding: 8px; text-align: center; color: black; border-radius: 5px; font-family: 'Signika', sans-serif;">
                    <h3 style="color: ${cfg.color}; border-bottom: 1px solid ${cfg.border}; margin: 0 0 5px 0; font-weight: bold;">
                        ${cfg.label}
                    </h3>
                    <div style="font-size: 13px; margin-bottom: 5px;">
                        <strong>Cozinhando:</strong> ${tipoLegivel}<br>
                        <strong>Ferramenta:</strong> ${toolLabel}
                    </div>
                    <div style="font-size: 14px; font-weight: bold; color: #333;">
                        Resultado: <span style="color: ${cfg.color};">${resultadoTexto}</span>
                    </div>
                </div>
            `;

            refeicoesProntas.push({ nome: tipoLegivel, resultado: resultadoTexto, timestamp: Date.now() }); 
            await actor.setFlag("professions-reworked-5e", "refeicoesProntas", refeicoesProntas); 
            
            r.toMessage({
                speaker: ChatMessage.getSpeaker({actor}),
                flavor: contentHTML
            });

        } catch (err) { 
            ui.notifications.error("Erro na rolagem de cozinha: " + err.message); 
            tabParaManter = null; // Reset em caso de erro
        }
    });

    html.find('.profession-tool-select').change(async (ev) => { salvarScroll(); const profName = ev.currentTarget.closest('.profession-section').dataset.prof; ferramentasEquipadas[profName] = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "ferramentasEquipadas", ferramentasEquipadas); });
    html.find('.roll-attribute').change(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.project-card'); const index = card.dataset.index; if (listaProjetos[index]) { listaProjetos[index].atributoPadrao = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); } });
    html.find('.adv-checkbox').change(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.project-card'); const index = card.dataset.index; if (listaProjetos[index]) { listaProjetos[index].usoVantagem = ev.currentTarget.checked; await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); } });
    
    html.find('.disadv-checkbox').change(async (ev) => { 
        salvarScroll(); 
        const card = ev.currentTarget.closest('.project-card'); 
        if (!card) return; // Evita erro se clicar fora
        const index = card.dataset.index; 
        if (listaProjetos[index]) { 
            listaProjetos[index].usoDesvantagem = ev.currentTarget.checked; 
            await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); 
        } 
    });

    html.find('.roll-bonus').change(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.project-card'); const index = card.dataset.index; if (listaProjetos[index]) { listaProjetos[index].bonusSituacional = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); } });
    
    html.find('.edit-project-name').click(async (ev) => { 
        ev.stopPropagation(); 
        salvarScroll(); // Define tabParaManter
        const card = ev.currentTarget.closest('.project-card'); 
        const index = card.dataset.index; 
        const projeto = listaProjetos[index]; 
        if (projeto) { 
            new Dialog({ 
                title: "Editar Projeto", 
                content: `<form><div class="form-group"><label>Novo Nome:</label><input type="text" name="novoNome" value="${projeto.nome}" autofocus></div></form>`, 
                buttons: { 
                    salvar: { 
                        label: "Salvar", 
                        icon: '<i class="fas fa-check"></i>', 
                        callback: async (html) => { 
                            const novoNome = html.find('[name="novoNome"]').val(); 
                            if (novoNome && novoNome.trim() !== "") { 
                                listaProjetos[index].nome = novoNome.trim(); 
                                await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); 
                            } else { 
                                tabParaManter = null; // Cancela se nome vazio
                            } 
                        } 
                    }, 
                    cancelar: { 
                        label: "Cancelar", 
                        icon: '<i class="fas fa-times"></i>', 
                        callback: () => { tabParaManter = null; } 
                    } 
                }, 
                default: "salvar" 
            }).render(true); 
        } 
    });
    
    html.find('.prof-header').click(async (ev) => { if ($(ev.target).closest('.remove-profession').length) return; salvarScroll(); const profName = ev.currentTarget.closest('.profession-section').dataset.prof; colapsos[profName] = !colapsos[profName]; await actor.setFlag("professions-reworked-5e", "colapsos", colapsos); });
    
    html.find('.remove-profession').click(async (ev) => { 
        ev.stopPropagation(); 
        salvarScroll(); 
        const profName = ev.currentTarget.closest('.profession-section').dataset.prof; 
        const confirm = await Dialog.confirm({ title: "Abandonar", content: `<p>Remover <strong>${profName}</strong>?</p>` }); 
        if (confirm) { 
            const novasProf = profissoesAtivas.filter(p => p !== profName); 
            const novosProj = listaProjetos.filter(p => p.profissao !== profName); 
            
            await actor.update({
                "flags.professions-reworked-5e.profissoesAtivas": novasProf,
                "flags.professions-reworked-5e.projetos": novosProj
            });
        } else { 
            tabParaManter = null; 
        } 
    });
    html.find('.add-profession-btn').click(async (ev) => { salvarScroll(); const novaProf = html.find('.select-new-profession').val(); if (!profissoesAtivas.includes(novaProf)) { profissoesAtivas.push(novaProf); await actor.setFlag("professions-reworked-5e", "profissoesAtivas", profissoesAtivas); } });
    
    html.find('.delete-project').click(async (ev) => { 
        salvarScroll(); 
        const card = ev.currentTarget.closest('.project-card'); 
        const index = card.dataset.index; 
        if (index !== undefined && listaProjetos[index]) { 
            const proj = listaProjetos[index]; 
            const confirm = await Dialog.confirm({ title: "Excluir", content: `<p>Excluir <strong>${proj.nome}</strong>?</p>` }); 
            if (confirm) { 
                listaProjetos.splice(index, 1); 
                await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); 
            } else { 
                tabParaManter = null; 
            } 
        } else { 
            tabParaManter = null; 
        } 
    });
    
    html.find('.new-project-subtype').change(ev => {
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const profSection = container.closest('.profession-section');
        const pName = profSection.data('prof');
        if (pName === "Alquimista") atualizarDropdownAlquimista(container);
        if (pName === "Carpinteiro") atualizarDropdownCarpinteiro(container);
        if (pName === "Coureiro") atualizarDropdownCoureiro(container);
        if (pName === "Engenheiro") atualizarDropdownEngenheiro(container);
        if (pName === "Escriba") atualizarDropdownEscriba(container);
        if (pName === "Ferreiro") atualizarDropdownFerreiro(container);
        if (pName === "Herbalista") atualizarDropdownHerbalista(container);
        if (pName === "Joalheiro") atualizarDropdownJoalheiro(container);
        if (pName === "Oleiro") atualizarDropdownOleiro(container);
        if (pName === "Pedreiro") atualizarDropdownPedreiro(container);
        if (pName === "Sicário") atualizarDropdownSicario(container);
        if (pName === "Tecelão") atualizarDropdownTecelao(container);
        if (pName === "Cartógrafo") atualizarDropdownCartografo(container);
    });

    html.find('.create-project-btn').click(async (ev) => {
        salvarScroll();
        const prof = ev.currentTarget.closest('.profession-section').dataset.prof;
        const container = $(ev.currentTarget.closest('.project-creation-form'));
        const nomeInput = container.find('.new-project-name').val();
        const subTipo = container.find('.new-project-subtype').val();
        let valorComplexidade = container.find('.new-project-complexity').val();
        const valorRaridadePreparo = container.find('.new-project-rarity').val();
        const isPlateChecked = container.find('.plate-check').is(':checked');
        const valorBioma = container.find('.new-project-biome').val();
        const valorGemaRaridade = container.find('.new-project-gem-rarity').val();
        const valorGemaPC = parseInt(container.find('.new-project-value').val()) || 0;
        
        const valorIdadeDragao = container.find('.new-project-dragon-age').val();
        const valorTipoVeneno = container.find('.new-project-poison-type').val();
        const valorTipoErva = container.find('.new-project-herb-type').val();

        let dificuldadeOverride = null;
        let raridadeSalva = null;
        let tipoArmaSalvo = null;
        let tipoArmaduraSalva = null;
        let acertosTotaisPreparo = null;
        let biomaSalvo = null;
        let valorAtual = 0; 
        
        let idadeDragaoSalva = null;
        let tipoVenenoColetaSalva = null;
        let tipoErvaSalva = null;
        let faseCartografo = null;

        // ALQUIMISTA
        if (prof === "Alquimista" && subTipo === "Poção") {
            raridadeSalva = valorComplexidade;
            const configPocao = ALQUIMISTA_POCAO[valorComplexidade];
            if (configPocao) {
                dificuldadeOverride = configPocao.dificuldade;
                valorComplexidade = configPocao.complexidade;
            }
        }
        
        if (prof === "Carpinteiro" && subTipo === "Arma de Madeira") { tipoArmaSalvo = valorComplexidade; const configArma = CARPINTEIRO_ARMA[valorComplexidade]; if (configArma) valorComplexidade = configArma.complexidade; }
        if (prof === "Coureiro") { if (subTipo === "Armadura de Couro") { tipoArmaduraSalva = valorComplexidade; const config = COUREIRO_ARMADURA[valorComplexidade]; if (config) valorComplexidade = config.complexidade; } else if (subTipo === "Arma de Couro") { tipoArmaSalvo = valorComplexidade; const config = COUREIRO_ARMA[valorComplexidade]; if (config) valorComplexidade = config.complexidade; } else if (subTipo === "Conserto") { const configComp = COMPLEXIDADE_PROJETO[valorComplexidade]; if (configComp) acertosTotaisPreparo = Math.ceil(configComp.acertosNecessarios / 2); } }
        if (prof === "Engenheiro") { if (subTipo === "Mecanismo Improvisado" || subTipo === "Conserto") { const configComp = COMPLEXIDADE_PROJETO[valorComplexidade]; if (configComp) acertosTotaisPreparo = Math.ceil(configComp.acertosNecessarios / 2); } }
        if (prof === "Escriba" && subTipo === "Pergaminho de Magia") { raridadeSalva = valorComplexidade; const configPergaminho = ESCRIBA_PERGAMINHO[valorComplexidade]; if (configPergaminho) { dificuldadeOverride = configPergaminho.dificuldade; valorComplexidade = configPergaminho.complexidade; } }
        if (prof === "Ferreiro") { if (subTipo === "Arma de Metal") { tipoArmaSalvo = valorComplexidade; const config = FERREIRO_ARMA[valorComplexidade]; if (config) valorComplexidade = config.complexidade; } else if (subTipo === "Armadura de Metal") { tipoArmaduraSalva = valorComplexidade; if (valorComplexidade === "Armadura Pesada" && isPlateChecked) { valorComplexidade = "Muito Complexo"; tipoArmaduraSalva += " (Placas)"; } else { const config = FERREIRO_ARMADURA[valorComplexidade]; if (config) valorComplexidade = config.complexidade; } } else if (subTipo === "Conserto") { const configComp = COMPLEXIDADE_PROJETO[valorComplexidade]; if (configComp) acertosTotaisPreparo = Math.ceil(configComp.acertosNecessarios / 2); } }
        if (subTipo === "Preparo para Encantamento") { if (!valorRaridadePreparo) { ui.notifications.warn("Selecione a Raridade do Encanto!"); tabParaManter = null; return; } raridadeSalva = valorRaridadePreparo; if (PREPARO_ENCANTAMENTO[raridadeSalva] && PREPARO_ENCANTAMENTO[raridadeSalva][valorComplexidade]) { acertosTotaisPreparo = PREPARO_ENCANTAMENTO[raridadeSalva][valorComplexidade]; } else { acertosTotaisPreparo = 10; } dificuldadeOverride = "Muito Difícil"; }
        
        // CORREÇÃO: Criação Herbalista simplificada
        if (prof === "Herbalista") {
            let metaAcertos = "Simples";

            if (subTipo === "Tintura Mágica") {
                if (!valorRaridadePreparo) { ui.notifications.warn("Selecione a Raridade!"); tabParaManter = null; return; }
                raridadeSalva = valorRaridadePreparo;
                if (raridadeSalva === "Comum") metaAcertos = "Simples";
                if (raridadeSalva === "Incomum") metaAcertos = "Moderadamente Complexo";
                if (raridadeSalva === "Raro") metaAcertos = "Complexo";
                if (raridadeSalva === "Muito Raro") metaAcertos = "Muito Complexo";
                if (raridadeSalva === "Lendário") metaAcertos = "Muito Complexo";
            } else if (subTipo === "Erva de Poção") {
                metaAcertos = HERBALISTA_META["Erva de Poção"];
            } else {
                metaAcertos = HERBALISTA_META[subTipo] || "Simples";
            }
            
            valorComplexidade = metaAcertos;
            dificuldadeOverride = "Selecione Bioma";
        }

        if (prof === "Joalheiro") { if (subTipo === "Gema Lapidada") { if (!valorGemaRaridade) { ui.notifications.warn("Selecione a Raridade da Gema!"); tabParaManter = null; return; } if (valorGemaPC <= 0) { ui.notifications.warn("Insira um Valor inicial válido!"); tabParaManter = null; return; } raridadeSalva = valorGemaRaridade; valorAtual = valorGemaPC; const configGema = JOALHEIRO_GEMA[raridadeSalva]; if (configGema) { valorComplexidade = configGema.complexidade; } } else if (subTipo === "Encrustar Gemas para Encantamento") { if (!valorRaridadePreparo) { ui.notifications.warn("Selecione a Raridade do Item!"); tabParaManter = null; return; } raridadeSalva = valorRaridadePreparo; const configEncrustar = JOALHEIRO_ENCRUSTAR[raridadeSalva]; if (configEncrustar) { dificuldadeOverride = configEncrustar.dificuldade; valorComplexidade = "Complexo"; } } }
        if (prof === "Sicário") { if (subTipo === "Veneno Básico") { valorComplexidade = "Simples"; } else if (subTipo === "Veneno Avançado") { valorComplexidade = "Moderadamente Complexo"; } else if (subTipo === "Coleta de Veneno de Monstro") { if (!valorTipoVeneno) { ui.notifications.warn("Selecione o Tipo de Veneno!"); tabParaManter = null; return; } tipoVenenoColetaSalva = valorTipoVeneno; const configColeta = SICARIO_COLETA_DIFF[valorTipoVeneno]; if (configColeta) { dificuldadeOverride = configColeta.dificuldade; valorComplexidade = "Simples"; } } else if (subTipo === "Coleta de Erva Venenosa") { if (!valorTipoErva) { ui.notifications.warn("Selecione o Tipo de Erva!"); tabParaManter = null; return; } tipoErvaSalva = valorTipoErva; if (valorTipoErva === "Veneno Básico") { valorComplexidade = "Simples"; } else if (valorTipoErva === "Veneno Avançado") { valorComplexidade = "Moderadamente Complexo"; } } }
        if (prof === "Tecelão") { if (subTipo === "Conserto") { const configComp = COMPLEXIDADE_PROJETO[valorComplexidade]; if (configComp) acertosTotaisPreparo = Math.ceil(configComp.acertosNecessarios / 2); } }

        if (prof === "Cartógrafo") {
            if (subTipo === "Cópia de Mapa") {
                valorComplexidade = "Moderadamente Complexo";
            } else if (subTipo === "Desenho de Mapa") {
                faseCartografo = "rascunho";
                acertosTotaisPreparo = 0; 
                valorComplexidade = "Simples"; 
            }
        }
        
        listaProjetos.push({
            nome: nomeInput || `Novo Projeto de ${prof}`,
            profissao: prof,
            subTipo: subTipo,
            timestamp: Date.now(),
            complexidade: valorComplexidade,
            dificuldadeEspecifica: dificuldadeOverride,
            raridade: raridadeSalva,
            tipoArma: tipoArmaSalvo,
            tipoArmadura: tipoArmaduraSalva,
            bioma: biomaSalvo,
            acertosTotaisPreparo: acertosTotaisPreparo,
            acertosAtuais: 0,
            atributoPadrao: "int", 
            usoVantagem: false,
            bonusSituacional: "",
            valorAtual: valorAtual,
            idadeDragao: idadeDragaoSalva,
            tipoVenenoColeta: tipoVenenoColetaSalva,
            tipoErva: tipoErvaSalva,
            fase: faseCartografo,
            xpColetado: false
        });
        await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);
    });

    html.find('.roll-profession-test').click(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        const profSection = ev.currentTarget.closest('.profession-section');
        const profName = profSection.dataset.prof;
        
        const projeto = listaProjetos[index];
        if (!projeto) { tabParaManter = null; return; }

        if (projeto.subTipo === "Gema Lapidada" && projeto.valorAtual <= 0) {
            ui.notifications.warn("Esta gema está quebrada e não pode mais ser trabalhada.");
            tabParaManter = null; // Reset
            return;
        }

        const attributeKey = projeto.atributoPadrao || "int";
        const hasAdvantage = projeto.usoVantagem || false;
        const hasDisadvantage = projeto.usoDesvantagem || false;
        const situationalBonus = projeto.bonusSituacional || "";
        const toolId = ferramentasEquipadas[profName] || ""; 
        const hasTool = toolId !== "";

        const attrMod = actor.system.abilities[attributeKey].mod;
        const attrLabel = ATRIBUTOS[attributeKey];

        let profBonus = 0;
        let toolLabel = "Sem Ferramenta";
        let isExpertise = false; 
        
        if (hasTool) {
            const toolItem = actor.items.get(toolId);
            if (toolItem) {
                toolLabel = toolItem.name;
                const profMultiplier = toolItem.system.prof?.multiplier || 0; 
                profBonus = Math.floor(actor.system.attributes.prof * profMultiplier);
                if (profMultiplier >= 2) isExpertise = true; 
            }
        }

        let diceFormula = "1d20";
        if (hasTool && hasAdvantage && !hasDisadvantage) diceFormula = "2d20kh1"; 
        else if (!hasAdvantage && (hasDisadvantage || !hasTool)) diceFormula = "2d20kl1"; 
        else diceFormula = "1d20"; 

        let formula = `${diceFormula} + ${attrMod}[${attrLabel}]`;
        if (profBonus > 0) formula += ` + ${profBonus}[Prof]`;
        if (situationalBonus) formula += ` + ${situationalBonus}[Sit]`;

        try {
            const r = new Roll(formula, actor.getRollData());
            await r.evaluate();

            let diffAlvo = projeto.dificuldadeEspecifica || COMPLEXIDADE_PROJETO[projeto.complexidade].dificuldade;
            
            // CORREÇÃO: Validação de Bioma na Rolagem
            if ((projeto.profissao === "Cartógrafo" && projeto.fase === "rascunho") || projeto.profissao === "Herbalista") {
                if (!projeto.bioma) {
                    ui.notifications.warn("Selecione o Bioma no card do projeto!");
                    tabParaManter = null;
                    return;
                }
            } else if (projeto.profissao === "Cartógrafo" && projeto.fase === "definitivo") {
                diffAlvo = "Difícil";
            }

            const res = calcularResultado(r.total, diffAlvo);
            
            const cfg = RESULTADO_FORMAT[res.resultado] || { label: res.resultado, color: "black", bg: "#eee", border: "#ccc" };
            
            let detalhesResultado = "";
            let metaAcertos = 0; 

            if (projeto.subTipo === "Coleta de Veneno de Monstro") {
                const formulaDoses = SICARIO_DOSES[res.resultado];
                let textoDoses = "";
                if (formulaDoses === "0") {
                    projeto.resultadoColeta = "Nenhuma dose coletada.";
                    textoDoses = "Nenhuma dose coletada.";
                } else {
                    const rollDoses = new Roll(formulaDoses);
                    await rollDoses.evaluate();
                    projeto.resultadoColeta = `${rollDoses.total} Doses (${formulaDoses})`;
                    textoDoses = `<strong>${rollDoses.total}</strong> Doses coletadas!`;
                }
                projeto.isConcluido = true; 
                projeto.dataConclusao = Date.now();
                detalhesResultado = `<div style="font-size: 14px; font-weight: bold; color: ${cfg.color};">${textoDoses}</div>`;
            } 
            else if (projeto.profissao === "Cartógrafo" && projeto.fase === "rascunho") {
                const incremento = CARTOGRAFO_RASCUNHO_INC[res.resultado] || 0;
                if (!projeto.totalNecessario) projeto.totalNecessario = 0;
                projeto.totalNecessario += incremento;
                detalhesResultado = `<div style="font-size: 13px; color: #333;">Meta aumentada em: <strong>+${incremento}</strong><br>Nova Meta: <strong>${projeto.totalNecessario}</strong></div>`;
            } 
            else {
                if (projeto.profissao === "Cartógrafo" && projeto.fase === "definitivo" && isExpertise) res.acertos *= 2;

                if (projeto.profissao === "Cartógrafo" && projeto.fase === "definitivo") metaAcertos = projeto.totalNecessario;
                else if (projeto.acertosTotaisPreparo) metaAcertos = projeto.acertosTotaisPreparo;
                else { const compConfig = COMPLEXIDADE_PROJETO[projeto.complexidade]; metaAcertos = compConfig ? compConfig.acertosNecessarios : 100; }

                projeto.acertosAtuais += res.acertos;
                if (projeto.acertosAtuais > metaAcertos) projeto.acertosAtuais = metaAcertos;

                // --- NOVO: Grava a Data de Conclusão ---
                // Se completou a meta E ainda não tinha data de conclusão gravada
                if (projeto.acertosAtuais >= metaAcertos && !projeto.dataConclusao) {
                    projeto.dataConclusao = Date.now();
                }

                let msgDano = "";
                if (projeto.subTipo === "Gema Lapidada") {
                    if (res.resultado === "ALTA_FALHA" || res.resultado === "GRANDE_FALHA") {
                        const danoRoll = new Roll("1d4");
                        await danoRoll.evaluate();
                        const dano = danoRoll.total;
                        projeto.valorAtual -= dano;
                        if (projeto.valorAtual <= 0) projeto.valorAtual = 0; 
                        msgDano = `<div style="color:red; font-weight:bold; margin-top:5px;">Dano na Gema: -${dano} PC! (Valor: ${projeto.valorAtual})</div>`;
                        if (projeto.valorAtual === 0) msgDano += `<div style="color:red; font-weight:bold;">A GEMA QUEBROU!</div>`;
                    }
                }
                
                let xpText = `(+${res.acertos} Acertos)`;
                if (projeto.profissao === "Cartógrafo" && projeto.fase === "definitivo" && isExpertise) xpText += " (Expertise!)";

                detalhesResultado = `
                    <div style="font-size: 14px; font-weight: bold; color: ${cfg.color}; margin-top: 5px;">
                        ${cfg.label} <span style="font-size: 12px; color: #555;">${xpText}</span>
                    </div>
                    ${msgDano}
                `;
            }

            const contentHTML = `
                <div style="border: 2px solid ${cfg.border}; background-color: ${cfg.bg}; padding: 8px; text-align: center; color: black; border-radius: 5px; font-family: 'Signika', sans-serif;">
                    <h3 style="color: ${cfg.color}; border-bottom: 1px solid ${cfg.border}; margin: 0 0 5px 0; font-weight: bold;">
                        ${cfg.label}
                    </h3>
                    <div style="font-size: 12px; margin-bottom: 5px; color: #444;">
                        <strong>Trabalhando:</strong> ${projeto.nome}<br>
                        <strong>Ferramenta:</strong> ${toolLabel}
                    </div>
                    ${detalhesResultado}
                </div>
            `;

            await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);

            r.toMessage({
                speaker: ChatMessage.getSpeaker({actor}),
                flavor: contentHTML
            });

        } catch (err) {
            ui.notifications.error("Erro na fórmula: " + err.message);
            tabParaManter = null; // Reset
        }
    });
    // --- NOVOS LISTENERS PARA TREINAMENTO ---

    // 1. INICIAR TREINO DE PERÍCIA
    html.find('.start-skill-training-btn').click(async (ev) => {
        salvarScroll();
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const skillKey = container.find('.new-training-skill').val();

        if (!skillKey) {
            ui.notifications.warn("Selecione uma perícia para treinar!");
            tabParaManter = null;
            return;
        }

        const skillData = actor.system.skills[skillKey];
        const skillLabel = CONFIG.DND5E.skills[skillKey]?.label || skillKey;
        
        // Define Dificuldade e Meta baseado na proficiência atual (0 ou 1)
        const isProficient = (skillData.value === 1);
        const meta = isProficient ? 50 : 20; //Aqui podemos fazer balanceamento
        const diff = isProficient ? "Difícil" : "Fácil"; // (Seu mestre definiu isso) - aqui podemos fazer balanceamento
        const infoExtra = isProficient ? "(Proficiente - Difícil)" : "(Sem Proficiência - Fácil)";

        listaTreinamentos.push({
            categoria: "Perícia",
            nome: `Treinamento de ${skillLabel}`,
            skillKey: skillKey,
            acertosAtuais: 0,
            totalNecessario: meta,
            dificuldadeEspecifica: diff,
            infoExtra: infoExtra,
            usoVantagem: false,
            usoDesvantagem: false,
            bonusSituacional: ""
        });

        await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
    });

    // 1.5. INICIAR TREINO DE ATRIBUTO
    html.find('.start-attribute-training-btn').click(async (ev) => {
        salvarScroll();
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const attrKey = container.find('.new-training-attribute').val();

        if (!attrKey) {
            ui.notifications.warn("Selecione um atributo para treinar!");
            tabParaManter = null;
            return;
        }

        const attrLabel = ATRIBUTOS[attrKey];
        const valorAtual = actor.system.abilities[attrKey].value;

        // Define Meta e Dificuldade baseado no valor atual
        // Encontra o primeiro range onde o valor atual é menor ou igual ao max
        const config = TREINO_ATRIBUTO_RANGES.find(r => valorAtual <= r.max) || TREINO_ATRIBUTO_RANGES[TREINO_ATRIBUTO_RANGES.length - 1];
        
        const infoExtra = `(Valor atual: ${valorAtual} - ${config.diff})`;

        listaTreinamentos.push({
            categoria: "Atributo",
            nome: `Treinamento de ${attrLabel}`,
            attrKey: attrKey, // Guarda a chave (str, dex, etc)
            acertosAtuais: 0,
            totalNecessario: config.meta,
            dificuldadeEspecifica: config.diff,
            infoExtra: infoExtra,
            usoVantagem: false,
            usoDesvantagem: false,
            bonusSituacional: ""
        });

        await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
    });

    // 1.6. INICIAR TREINO DE RESISTÊNCIA
    html.find('.start-save-training-btn').click(async (ev) => {
        salvarScroll();
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const attrKey = container.find('.new-training-save').val();

        if (!attrKey) {
            ui.notifications.warn("Selecione um atributo para treinar resistência!");
            tabParaManter = null;
            return;
        }

        const attrLabel = ATRIBUTOS[attrKey];
        const valorAtual = actor.system.abilities[attrKey].value;

        // Configuração Fixa conforme solicitado
        const meta = 80;
        const diff = "Médio";
        const infoExtra = `(Valor atual: ${valorAtual} - Dificuldade: Médio)`;

        listaTreinamentos.push({
            categoria: "Resistência",
            nome: `Treinamento de Resistência de ${attrLabel}`,
            attrKey: attrKey, // Guarda a chave para pegar o mod na rolagem
            acertosAtuais: 0,
            totalNecessario: meta,
            dificuldadeEspecifica: diff,
            infoExtra: infoExtra,
            usoVantagem: false,
            usoDesvantagem: false,
            bonusSituacional: ""
        });

        await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
    });

    // 1.7. INICIAR TREINO DE TALENTO (NOVO)
    html.find('.start-feat-training-btn').click(async (ev) => {
        salvarScroll();
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const nomeInput = container.find('.new-training-name-feat').val();
        
        const nomeFinal = (nomeInput && nomeInput.trim() !== "") ? nomeInput : "Treinamento de Talento";

        // Configuração Fixa
        const meta = 60;
        const diff = "Médio";
        const infoExtra = `(Dificuldade: Médio)`;

        listaTreinamentos.push({
            categoria: "Talento",
            nome: nomeFinal,
            atributoPadrao: "str", // Default inicial
            acertosAtuais: 0,
            totalNecessario: meta,
            dificuldadeEspecifica: diff,
            infoExtra: infoExtra,
            usoVantagem: false,
            usoDesvantagem: false,
            bonusSituacional: ""
        });

        await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
    });

    // 1.8. INICIAR TREINO DE IDIOMA (NOVO)
    html.find('.start-language-training-btn').click(async (ev) => {
        salvarScroll();
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const langName = container.find('.new-training-language').val();

        if (!langName) {
            ui.notifications.warn("Selecione um idioma para aprender!");
            tabParaManter = null;
            return;
        }

        // Determina o Script Alvo
        const targetScript = LANGUAGES_DATA[langName];
        let meta = 30; // Padrão
        let diff = "Médio";
        
        // Verifica Scripts Compartilhados para redução de custo
        if (targetScript) { // Se a língua tem script (Deep Speech é null)
            const linguasConhecidasSet = new Set(actor.system.traits.languages.value.map(l => l.toLowerCase()));
            const mapaSistema = { "thieve's cant": "cant", "deep speech": "deep" };

            // Itera sobre todas as línguas possíveis do jogo
            for (const [nomeLingua, scriptLingua] of Object.entries(LANGUAGES_DATA)) {
                const chaveSistema = mapaSistema[nomeLingua.toLowerCase()] || nomeLingua.toLowerCase();
                
                // Se o ator conhece essa língua E ela compartilha o script com o alvo
                if (linguasConhecidasSet.has(chaveSistema) && scriptLingua === targetScript) {
                    meta = 15; // Reduz meta pela metade
                    break; // Já achou, pode parar
                }
            }
        }

        const infoExtra = `${langName} : Alfabeto ${targetScript || "Nenhum"} - Dificuldade: ${diff}`;

        listaTreinamentos.push({
            categoria: "Idioma",
            nome: `Aprendendo ${langName}`,
            acertosAtuais: 0,
            totalNecessario: meta,
            dificuldadeEspecifica: diff,
            infoExtra: infoExtra,
            usoVantagem: false,
            usoDesvantagem: false,
            bonusSituacional: ""
        });

        await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
    });

    // 1.9. INICIAR TREINO DE PROFISSÃO
    html.find('.start-profession-training-btn').click(async (ev) => {
        salvarScroll();
        const container = $(ev.currentTarget).closest('.project-creation-form');
        const profName = container.find('.new-training-profession-select').val();

        if (!profName) {
            ui.notifications.warn("Selecione uma profissão!");
            tabParaManter = null;
            return;
        }

        // 1. Identifica a ferramenta da profissão
        const configProf = PROFISSOES_CONFIG[profName];
        const baseTool = configProf ? configProf.ferramenta : "";
        
        // 2. Busca o item no inventário para ver o nível atual
        const toolItem = actor.items.find(i => i.type === "tool" && i.system.type.baseItem === baseTool);
        const multiplier = toolItem?.system?.prof?.multiplier || 0;

        // 3. Define a Meta baseada na proficiência
        // Se já for proficiente (>=1) a meta é 50. Se não (0), a meta é 20.
        const meta = (multiplier >= 1) ? 50 : 20;
        
        // (Opcional) Texto extra para mostrar o estado atual no card
        const estadoTexto2 = (multiplier >= 1) ? "Aprimorando" : "Aprendendo";
        const estadoTexto1 = (multiplier >= 1) ? "Proficiente" : "Não Proficiente";
        
        listaTreinamentos.push({
            categoria: "Profissão",
            profissaoAlvo: profName, // IMPORTANTE: Guardar qual profissão é
            nome: `Treinamento de ${profName}`,
            timestamp: Date.now(),
            acertosAtuais: 0,
            totalNecessario: meta,
            dificuldadeEspecifica: "Variável",
            infoExtra: `(${estadoTexto1} - ${estadoTexto2} - Ganhe XP completando projetos de ${profName})`,
            usoVantagem: false,
            usoDesvantagem: false,
            bonusSituacional: ""
        });

        await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
    });
    
    // 1.9.1. ADICIONAR XP (BOTÃO DE PROJETO)
    html.find('.add-xp-btn').not('.xp-meal-btn').click(async (ev) => {
        ev.stopPropagation();
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        const projeto = listaProjetos[index];

        if (!projeto) return;

        // Acha o treino
        const treinoIndex = listaTreinamentos.findIndex(t => 
            t.categoria === "Profissão" && 
            t.profissaoAlvo === projeto.profissao && 
            t.acertosAtuais < t.totalNecessario
        );

        if (treinoIndex === -1) {
            ui.notifications.warn("Nenhum treinamento ativo encontrado para esta profissão.");
            tabParaManter = null;
            return;
        }

        const treino = listaTreinamentos[treinoIndex];
        let xpAmount = 0;

        // EXCEÇÃO: SICÁRIO (Coleta)
        if (projeto.subTipo === "Coleta de Veneno de Monstro") {
            const toolItem = actor.items.find(i => i.type === "tool" && i.system.type.baseItem === "poison");
            const isProf = (toolItem && toolItem.system.prof?.multiplier >= 1) ? "proficiente" : "sem_proficiencia";
            // Extrai o tipo de veneno do infoExtra ou do próprio objeto se salvamos
            // Vamos usar projeto.tipoVenenoColeta que salvamos
            const tipoVeneno = projeto.tipoVenenoColeta; 
            
            xpAmount = XP_VENENO_COLETA[isProf][tipoVeneno] || 0;
        } else {
            // PADRÃO: Acertos Totais do Projeto
            xpAmount = projeto.acertosAtuais;
        }

        // Aplica XP
        treino.acertosAtuais += xpAmount;
        if (treino.acertosAtuais > treino.totalNecessario) treino.acertosAtuais = treino.totalNecessario;

        // Marca projeto como XP coletado
        projeto.xpColetado = true;

        // --- CHAT FORMATADO (DOURADO) ---
        const contentHTML = `
            <div style="border: 2px solid #b8860b; background-color: #fff8e1; padding: 8px; border-radius: 5px; font-family: 'Signika', sans-serif; color: black;">
                <h3 style="color: #b8860b; border-bottom: 1px solid #b8860b; margin: 0 0 5px 0; text-align: center; font-weight: bold;">
                    Treinamento de ${treino.profissaoAlvo}
                </h3>
                <div style="font-size: 13px; line-height: 1.4; margin-bottom: 5px;">
                    <strong>Jogador:</strong> ${actor.name}<br>
                    <strong>Projeto concluído:</strong> ${projeto.nome}
                </div>
                <div style="font-size: 14px; font-weight: bold; color: #b8860b; text-align: center; margin-top: 5px;">
                    ${xpAmount} Pontos de Experiência adicionados!
                </div>
            </div>
        `;

        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({actor}),
            content: contentHTML
        });

        // Salva ambos (usando update para segurança)
        await actor.update({
            "flags.professions-reworked-5e.projetos": listaProjetos,
            "flags.professions-reworked-5e.listaTreinamentos": listaTreinamentos
        });
    });

    // 1.9.2 ADICIONAR XP (BOTÃO DE REFEIÇÃO)
    html.find('.xp-meal-btn').click(async (ev) => {
        ev.stopPropagation();
        salvarScroll();
        const card = ev.currentTarget.closest('.meal-card');
        const index = card.dataset.index; // Índice na array refeicoesProntas
        const refeicao = refeicoesProntas[index];

        if (!refeicao) return;

        const treinoIndex = listaTreinamentos.findIndex(t => 
            t.categoria === "Profissão" && 
            t.profissaoAlvo === "Cozinheiro" && 
            t.acertosAtuais < t.totalNecessario
        );

        if (treinoIndex === -1) return;

        const treino = listaTreinamentos[treinoIndex];
        
        // Verifica Proficiência
        const toolItem = actor.items.find(i => i.type === "tool" && i.system.type.baseItem === "cook");
        const isProf = (toolItem && toolItem.system.prof?.multiplier >= 1) ? "proficiente" : "sem_proficiencia";
        
        // --- CORREÇÃO DA LÓGICA DE QUALIDADE ---
        let qualidadeChave = "";

        if (refeicao.nome === "Banquete") {
            // Se for Banquete, a chave é "Banquete" mesmo
            qualidadeChave = "Banquete";
        } else {
            // Se for refeição comum, a qualidade real está no texto do resultado (ex: "Aristocrat")
            // Precisamos limpar as tags HTML (<span>...</span>) para pegar só o texto
            // Cria um elemento temporário para extrair o texto puro
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = refeicao.resultado;
            qualidadeChave = tempDiv.textContent.trim(); // Pega "Aristocrat", "Comfortable", etc.
        }
        
        // Busca na tabela usando a chave correta
        const xpAmount = XP_COZINHEIRO[isProf][qualidadeChave] || 0;

        treino.acertosAtuais += xpAmount;
        if (treino.acertosAtuais > treino.totalNecessario) treino.acertosAtuais = treino.totalNecessario;

        refeicao.xpColetado = true;

        let textoRefeicaoDisplay = "";

        if (refeicao.nome === "Banquete")
            {
                textoRefeicaoDisplay = refeicao.nome;
            } else{
                textoRefeicaoDisplay = `${refeicao.nome} (${qualidadeChave})`
            }

        const contentHTML = `
            <div style="border: 2px solid #b8860b; background-color: #fff8e1; padding: 8px; border-radius: 5px; font-family: 'Signika', sans-serif; color: black;">
                <h3 style="color: #b8860b; border-bottom: 1px solid #b8860b; margin: 0 0 5px 0; text-align: center; font-weight: bold;">
                    Treinamento de Cozinheiro
                </h3>
                <div style="font-size: 13px; line-height: 1.4; margin-bottom: 5px;">
                    <strong>Jogador:</strong> ${actor.name}<br>
                    <strong>Refeição:</strong> ${textoRefeicaoDisplay}                  
                </div>
                <div style="font-size: 14px; font-weight: bold; color: #b8860b; text-align: center; margin-top: 5px;">
                    ${xpAmount} Pontos de Experiência adicionados!
                </div>
            </div>
        `;

        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({actor}),
            content: contentHTML
        });

        await actor.update({
            "flags.professions-reworked-5e.refeicoesProntas": refeicoesProntas,
            "flags.professions-reworked-5e.listaTreinamentos": listaTreinamentos
        });
    });



    // 2. EXCLUIR TREINO
    html.find('.delete-training-card').click(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        
        if (listaTreinamentos[index]) {
            const confirm = await Dialog.confirm({ 
                title: "Excluir Treino", 
                content: `<p>Excluir <strong>${listaTreinamentos[index].nome}</strong>?</p>` 
            });
            if (confirm) {
                listaTreinamentos.splice(index, 1);
                await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
            } else {
                tabParaManter = null;
            }
        }
    });

    // 2.5 EDITAR NOME DO TREINO (NOVO - Igual ao de projetos)
    html.find('.edit-training-name').click(async (ev) => {
        ev.stopPropagation();
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        const treino = listaTreinamentos[index];

        if (treino) {
            new Dialog({
                title: "Renomear Treinamento",
                content: `<form><div class="form-group"><label>Novo Nome:</label><input type="text" name="novoNome" value="${treino.nome}" autofocus></div></form>`,
                buttons: {
                    salvar: {
                        label: "Salvar",
                        icon: '<i class="fas fa-check"></i>',
                        callback: async (html) => {
                            const novoNome = html.find('[name="novoNome"]').val();
                            if (novoNome && novoNome.trim() !== "") {
                                listaTreinamentos[index].nome = novoNome.trim();
                                await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
                            } else {
                                tabParaManter = null;
                            }
                        }
                    },
                    cancelar: {
                        label: "Cancelar",
                        icon: '<i class="fas fa-times"></i>',
                        callback: () => { tabParaManter = null; }
                    }
                },
                default: "salvar"
            }).render(true);
        }
    });

    // 3. LISTENERS DOS TOGGLES DE TREINO

    // Mudar Atributo do Treino (Talento)
    html.find('.train-attribute-select').change(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        if (listaTreinamentos[index]) {
            listaTreinamentos[index].atributoPadrao = ev.currentTarget.value;
            await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
        }
    });

    html.find('.train-adv-checkbox').change(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        if (listaTreinamentos[index]) {
            listaTreinamentos[index].usoVantagem = ev.currentTarget.checked;
            await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
        }
    });
    html.find('.train-disadv-checkbox').change(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        if (listaTreinamentos[index]) {
            listaTreinamentos[index].usoDesvantagem = ev.currentTarget.checked;
            await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
        }
    });
    html.find('.train-bonus').change(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        if (listaTreinamentos[index]) {
            listaTreinamentos[index].bonusSituacional = ev.currentTarget.value;
            await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);
        }
    });

    // 4. ROLAR TREINO
    html.find('.roll-training-test').click(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        const treino = listaTreinamentos[index];

        if (!treino) { tabParaManter = null; return; }

        // Configuração de dados para a rolagem
        const hasAdv = treino.usoVantagem || false;
        const hasDis = treino.usoDesvantagem || false;
        const bonusSit = treino.bonusSituacional || "";

        // Fórmula de Dados
        let diceFormula = "1d20";
        if (hasAdv && !hasDis) diceFormula = "2d20kh1";
        else if (!hasAdv && hasDis) diceFormula = "2d20kl1";
        
        let formula = "";
        let nomeRolagem = "";
        
        // --- LÓGICA DE SELEÇÃO DO MODIFICADOR ---
        if (treino.categoria === "Perícia") {
            const skillKey = treino.skillKey;
            const skillTotal = actor.system.skills[skillKey].total;
            nomeRolagem = CONFIG.DND5E.skills[skillKey]?.label || skillKey;
            formula = `${diceFormula} + ${skillTotal}[${nomeRolagem}]`;
        } 
        else if (treino.categoria === "Atributo" || treino.categoria === "Resistência") {
            const attrKey = treino.attrKey;
            const attrMod = actor.system.abilities[attrKey].mod;
            nomeRolagem = ATRIBUTOS[attrKey];
            formula = `${diceFormula} + ${attrMod}[${nomeRolagem}]`;
        }
        // NOVA LÓGICA: Talento usa o atributo selecionado no dropdown
        else if (treino.categoria === "Talento") {
            const attrKey = treino.atributoPadrao || "str";
            const attrMod = actor.system.abilities[attrKey].mod;
            nomeRolagem = ATRIBUTOS[attrKey];
            formula = `${diceFormula} + ${attrMod}[${nomeRolagem}]`;
        }
        else if (treino.categoria === "Idioma") {
            const skillTotal = actor.system.skills.his.total;
            nomeRolagem = CONFIG.DND5E.skills.his?.label || "História";
            formula = `${diceFormula} + ${skillTotal}[${nomeRolagem}]`;
        }

        if (bonusSit) formula += ` + ${bonusSit}[Sit]`;

        try {
            const r = new Roll(formula, actor.getRollData());
            await r.evaluate();

            // Calcula resultado
            const diffAlvo = treino.dificuldadeEspecifica; // "Fácil" ou "Difícil"
            const res = calcularResultado(r.total, diffAlvo);

            // Atualiza progresso
            treino.acertosAtuais += res.acertos;
            if (treino.acertosAtuais > treino.totalNecessario) {
                treino.acertosAtuais = treino.totalNecessario;
            }

            // Formata Chat (Verde/Azul e Texto "Pontos de Experiência")
            const cfg = RESULTADO_FORMAT[res.resultado] || { label: res.resultado, color: "black", bg: "#eee", border: "#ccc" };
            
            const xpText = `(+${res.acertos} Pontos de Experiência)`;

            const contentHTML = `
                <div style="border: 2px solid ${cfg.border}; background-color: ${cfg.bg}; padding: 8px; text-align: center; color: black; border-radius: 5px; font-family: 'Signika', sans-serif;">
                    <h3 style="color: ${cfg.color}; border-bottom: 1px solid ${cfg.border}; margin: 0 0 5px 0; font-weight: bold;">
                        ${cfg.label}
                    </h3>
                    <div style="font-size: 12px; margin-bottom: 5px; color: #444;">
                        <strong>${treino.nome}</strong><br>
                        (Dificuldade: ${diffAlvo})
                    </div>
                    <div style="font-size: 14px; font-weight: bold; color: ${cfg.color}; margin-top: 5px;">
                        ${cfg.label} <span style="font-size: 12px; color: #555;">${xpText}</span>
                    </div>
                </div>
            `;

            await actor.setFlag("professions-reworked-5e", "listaTreinamentos", listaTreinamentos);

            r.toMessage({
                speaker: ChatMessage.getSpeaker({actor}),
                flavor: contentHTML
            });

        } catch (err) {
            ui.notifications.error("Erro no treino: " + err.message);
            tabParaManter = null;
        }
    });

});


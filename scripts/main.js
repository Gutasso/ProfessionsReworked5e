import { calcularResultado, processarCozinheiro } from './logic.js';
import { COMPLEXIDADE_PROJETO, PROFISSOES_CONFIG, ALQUIMISTA_POCAO, CARPINTEIRO_ARMA, COUREIRO_ARMADURA, COUREIRO_ARMA, FERREIRO_ARMADURA, FERREIRO_ARMA, ESCRIBA_PERGAMINHO, PREPARO_ENCANTAMENTO, HERBALISTA_BIOMAS, HERBALISTA_MATRIZ, HERBALISTA_META, JOALHEIRO_GEMA, JOALHEIRO_ENCRUSTAR, SICARIO_DRAGAO, SICARIO_COLETA_DIFF, SICARIO_DOSES, CARTOGRAFO_BIOMAS_LISTA, CARTOGRAFO_BIOMA_DIFF, CARTOGRAFO_RASCUNHO_INC } from './constants.js';

// --- VARIÁVEIS GLOBAIS ---
let manterAbaAberta = false;

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
function atualizarDropdownHerbalista(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity'),b=c.find('.new-project-biome');if(!s.length)return;const v=s.val();r.hide();x.hide();b.show();b.prop('disabled',false);const pop=(k)=>{let o='<option value="" disabled selected>Selecione o Bioma</option>';const t=HERBALISTA_MATRIZ[k];HERBALISTA_BIOMAS.forEach(i=>{if(t&&t[i])o+=`<option value="${i}">${i}</option>`});b.html(o)};if(v==="Tintura Mágica"){r.show();const rv=r.val();if(rv){let k="comum";if(rv==="Incomum")k="incomum";if(rv==="Raro")k="raro";if(rv==="Muito Raro")k="muito_raro";if(rv==="Lendário")k="lendario";pop(k)}else{b.html('<option value="" disabled selected>Escolha a Raridade primeiro</option>');b.prop('disabled',true)}}else if(v==="Erva de Poção"){pop("uva")}else{pop("padrao")}}
function atualizarDropdownJoalheiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),gr=c.find('.new-project-gem-rarity'),vi=c.find('.new-project-value'),ger=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();gr.hide();vi.hide();ger.hide();x.prop('disabled',false);x.show();if(v==="Gema Lapidada"){gr.show();vi.show();x.hide()}else if(v==="Encrustar Gemas para Encantamento"){ger.show();x.html('<option value="Complexo">Complexo</option>');x.prop('disabled',true)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownOleiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);x.show();if(v==="Item de Aventureiro de Argila"){x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option>`)}else if(v==="Item de Aventureiro de Vidro"){x.html(`<option value="Simples">Simples</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}else if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownPedreiro(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownSicario(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),da=c.find('.new-project-dragon-age'),pt=c.find('.new-project-poison-type'),ht=c.find('.new-project-herb-type');if(!s.length)return;const v=s.val();da.hide();pt.hide();ht.hide();x.show();x.prop('disabled',false);if(v==="Veneno Básico"){x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}else if(v==="Veneno Avançado"){x.html('<option value="Moderadamente Complexo">Moderado</option>');x.prop('disabled',true)}else if(v==="Veneno de Dragão Verde"){da.show();x.html('<option value="Complexo">Complexo</option>');x.prop('disabled',true)}else if(v==="Coleta de Veneno de Monstro"){pt.show();x.hide()}else if(v==="Coleta de Erva Venenosa"){ht.show();x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}}
function atualizarDropdownTecelao(c){const s=c.find('.new-project-subtype'),x=c.find('.new-project-complexity'),r=c.find('.new-project-rarity');if(!s.length)return;const v=s.val();r.hide();x.prop('disabled',false);x.show();if(v==="Item de Aventureiro"){x.html('<option value="Simples">Simples</option>');x.prop('disabled',true)}else if(v==="Preparo para Encantamento"){r.show();x.html(`<option value="Simples">Base Simples</option><option value="Moderadamente Complexo">Base Moderada</option><option value="Complexo">Base Complexa</option><option value="Muito Complexo">Base Muito Complexa</option>`)}else{x.html(`<option value="Simples">Simples</option><option value="Moderadamente Complexo">Moderado</option><option value="Complexo">Complexo</option><option value="Muito Complexo">Muito Complexo</option>`)}}
function atualizarDropdownCartografo(container) {const subTipoSelect = container.find('.new-project-subtype');const complexidadeSelect = container.find('.new-project-complexity');if (!subTipoSelect.length) return;const valorAtual = subTipoSelect.val();complexidadeSelect.prop('disabled', false);complexidadeSelect.show();if (valorAtual === "Cópia de Mapa") {complexidadeSelect.html('<option value="Moderadamente Complexo">Moderado</option>');complexidadeSelect.prop('disabled', true);} else if (valorAtual === "Desenho de Mapa") {complexidadeSelect.hide();}}

Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
    const actor = app.actor;

    const salvarScroll = () => {
        manterAbaAberta = true;
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
    let profissoesAtivas = actor.getFlag("professions-reworked-5e", "profissoesAtivas") || [];
    let listaProjetos = actor.getFlag("professions-reworked-5e", "projetos") || [];
    let colapsos = actor.getFlag("professions-reworked-5e", "colapsos") || {};
    let ferramentasEquipadas = actor.getFlag("professions-reworked-5e", "ferramentasEquipadas") || {};
    let refeicoesProntas = actor.getFlag("professions-reworked-5e", "refeicoesProntas") || [];
    let cookParams = actor.getFlag("professions-reworked-5e", "cookParams") || { atributoPadrao: "wis", usoVantagem: false, bonusSituacional: "" };

    const listaAtributos = Object.entries(ATRIBUTOS).map(([k, v]) => ({ value: k, label: v }));

    // 2. MAPEAR PROFISSÕES
    const profissoesRender = profissoesAtivas.map(pName => {
        const config = PROFISSOES_CONFIG[pName];
        const baseTool = config ? config.ferramenta : "";
        const ferramentasNoInventario = actor.items
            .filter(i => i.type === "tool" && i.system.type.baseItem === baseTool)
            .map(i => ({ id: i.id, name: i.name, selected: ferramentasEquipadas[pName] === i.id }));

        return {
            nome: pName,
            icon: ICONES_PROFISSAO[pName] || "fa-briefcase",
            isCozinheiro: pName === "Cozinheiro",
            isCollapsed: colapsos[pName] || false,
            
            cookParams: cookParams,
            refeicoes: refeicoesProntas,
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
                    if (proj.profissao === "Herbalista") {
                        const diffDisplay = proj.dificuldadeEspecifica || "Desconhecido";
                        infoExtra = ` (${proj.bioma} - ${diffDisplay})`;
                        if (proj.raridade) infoExtra = ` (${proj.raridade} - ${proj.bioma} - ${diffDisplay})`;
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
                        if (proj.subTipo === "Veneno de Dragão Verde" && proj.idadeDragao) {
                            infoExtra = ` (${proj.idadeDragao} - ${proj.dificuldadeEspecifica} - ${proj.complexidade})`;
                        }
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

                    // --- CORREÇÃO AQUI ---
                    // Verifica se já está concluído no banco (Coleta) OU se atingiu a meta calculada (exceto Rascunho/Coleta)
                    const isConcluido = proj.isConcluido || (!isRascunho && !isColeta && proj.acertosAtuais >= totalNecessario);

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
                        listaBiomas: CARTOGRAFO_BIOMAS_LISTA
                    };
                })
        };
    });

    const templatePath = "modules/professions-reworked-5e/templates/professions-tab.hbs";
    const myTabHtml = await renderTemplate(templatePath, { 
        profissoesAtivas: profissoesRender,
        todasProfissoes: Object.keys(PROFISSOES_CONFIG)
    });

    const tabs = html.find('.sheet-navigation.tabs');
    if (tabs.find('[data-tab="professions"]').length === 0) {
        tabs.append($('<a class="item" data-tab="professions">Profissões</a>'));
    }
    
    html.find('.professions-tab').remove();
    html.find('.sheet-body').append($(myTabHtml));

    // Inicialização de Dropdowns
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

    if (manterAbaAberta || app._tabs[0].active === "professions") {
        app._tabs[0].activate("professions");
        if (app._scrollInfo && app._scrollInfo.pos > 0) {
            let target = app.element.find(app._scrollInfo.selector);
            if (!target.length) target = app.element.find('.sheet-body');
            if (target.length) {
                target.scrollTop(app._scrollInfo.pos);
                requestAnimationFrame(() => target.scrollTop(app._scrollInfo.pos));
            }
        }
        manterAbaAberta = false;
    }

    // --- EVENTOS ---

    html.find('.card-biome-select').change(async (ev) => {
        salvarScroll();
        const card = ev.currentTarget.closest('.project-card');
        const index = card.dataset.index;
        const novoBioma = ev.currentTarget.value;
        if (listaProjetos[index]) {
            listaProjetos[index].bioma = novoBioma;
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
            manterAbaAberta = true;
            if (listaProjetos[index]) {
                listaProjetos[index].fase = "definitivo";
                listaProjetos[index].acertosAtuais = 0; 
            }
            await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);
        } else { manterAbaAberta = false; }
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
    html.find('.cook-adv-checkbox').change(async (ev) => { salvarScroll(); cookParams.usoVantagem = ev.currentTarget.checked; await actor.setFlag("professions-reworked-5e", "cookParams", cookParams); });
    html.find('.cook-bonus').change(async (ev) => { salvarScroll(); cookParams.bonusSituacional = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "cookParams", cookParams); });
    html.find('.delete-meal').click(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.meal-card'); const index = card.dataset.index; if (index !== undefined) { refeicoesProntas.splice(index, 1); await actor.setFlag("professions-reworked-5e", "refeicoesProntas", refeicoesProntas); } });
    html.find('.cook-test').click(async (ev) => {
        salvarScroll(); const tipo = ev.currentTarget.dataset.type; const profName = "Cozinheiro"; const attributeKey = cookParams.atributoPadrao || "wis"; const hasAdvantage = cookParams.usoVantagem || false; const situationalBonus = cookParams.bonusSituacional || ""; const toolId = ferramentasEquipadas[profName] || ""; const hasTool = toolId !== ""; const attrMod = actor.system.abilities[attributeKey].mod; const attrLabel = ATRIBUTOS[attributeKey]; let profBonus = 0; let toolLabel = "Sem Ferramenta"; if (hasTool) { const toolItem = actor.items.get(toolId); if (toolItem) { toolLabel = toolItem.name; const profMultiplier = toolItem.system.prof?.multiplier || 0; profBonus = Math.floor(actor.system.attributes.prof * profMultiplier); } } let diceFormula = "1d20"; if (!hasTool) { if (!hasAdvantage) diceFormula = "2d20kl1"; } else { if (hasAdvantage) diceFormula = "2d20kh1"; } let formula = `${diceFormula} + ${attrMod}[${attrLabel}]`; if (profBonus > 0) formula += ` + ${profBonus}[Prof]`; if (situationalBonus) formula += ` + ${situationalBonus}[Sit]`;
        try { const r = new Roll(formula, actor.getRollData()); await r.evaluate(); const resCozinha = processarCozinheiro(r.total, tipo); let resultadoTexto = resCozinha.efeitoFinal; if (tipo === "BANQUETE" && resultadoTexto !== "0") { if (resultadoTexto.includes("d")) { try { const level = actor.system.details?.cr || actor.system.details?.level || 1; const rollPV = new Roll(resultadoTexto, { level: level }); await rollPV.evaluate(); resultadoTexto = `<strong>${rollPV.total}</strong> PV Temp.`; } catch (innerErr) { console.error("Erro interno no Banquete:", innerErr); resultadoTexto += " (Erro calc.)"; } } } refeicoesProntas.push({ nome: tipo.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase()), resultado: resultadoTexto, timestamp: Date.now() }); await actor.setFlag("professions-reworked-5e", "refeicoesProntas", refeicoesProntas); ChatMessage.create({ content: `<div style="font-size:13px"><strong>Cozinhando: ${tipo}</strong><br>Ferramenta: ${toolLabel}<br>Teste: <b>${r.total}</b><br>Resultado: <span style="color:#4b0082; font-weight:bold">${resultadoTexto}</span></div>` }); } catch (err) { ui.notifications.error("Erro na rolagem de cozinha: " + err.message); manterAbaAberta = false; }
    });
    html.find('.profession-tool-select').change(async (ev) => { salvarScroll(); const profName = ev.currentTarget.closest('.profession-section').dataset.prof; ferramentasEquipadas[profName] = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "ferramentasEquipadas", ferramentasEquipadas); });
    html.find('.roll-attribute').change(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.project-card'); const index = card.dataset.index; if (listaProjetos[index]) { listaProjetos[index].atributoPadrao = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); } });
    html.find('.adv-checkbox').change(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.project-card'); const index = card.dataset.index; if (listaProjetos[index]) { listaProjetos[index].usoVantagem = ev.currentTarget.checked; await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); } });
    html.find('.roll-bonus').change(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.project-card'); const index = card.dataset.index; if (listaProjetos[index]) { listaProjetos[index].bonusSituacional = ev.currentTarget.value; await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); } });
    html.find('.edit-project-name').click(async (ev) => { ev.stopPropagation(); salvarScroll(); const card = ev.currentTarget.closest('.project-card'); const index = card.dataset.index; const projeto = listaProjetos[index]; if (projeto) { new Dialog({ title: "Editar Projeto", content: `<form><div class="form-group"><label>Novo Nome:</label><input type="text" name="novoNome" value="${projeto.nome}" autofocus></div></form>`, buttons: { salvar: { label: "Salvar", icon: '<i class="fas fa-check"></i>', callback: async (html) => { manterAbaAberta = true; const novoNome = html.find('[name="novoNome"]').val(); if (novoNome && novoNome.trim() !== "") { listaProjetos[index].nome = novoNome.trim(); await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); } else { manterAbaAberta = false; } } }, cancelar: { label: "Cancelar", icon: '<i class="fas fa-times"></i>', callback: () => { manterAbaAberta = false; } } }, default: "salvar" }).render(true); } });
    html.find('.prof-header').click(async (ev) => { if ($(ev.target).closest('.remove-profession').length) return; salvarScroll(); const profName = ev.currentTarget.closest('.profession-section').dataset.prof; colapsos[profName] = !colapsos[profName]; await actor.setFlag("professions-reworked-5e", "colapsos", colapsos); });
    html.find('.remove-profession').click(async (ev) => { ev.stopPropagation(); salvarScroll(); const profName = ev.currentTarget.closest('.profession-section').dataset.prof; const confirm = await Dialog.confirm({ title: "Abandonar", content: `<p>Remover <strong>${profName}</strong>?</p>` }); if (confirm) { manterAbaAberta = true; const novasProf = profissoesAtivas.filter(p => p !== profName); const novosProj = listaProjetos.filter(p => p.profissao !== profName); await actor.setFlag("professions-reworked-5e", "profissoesAtivas", novasProf); await actor.setFlag("professions-reworked-5e", "projetos", novosProj); } else { manterAbaAberta = false; } });
    html.find('.add-profession-btn').click(async (ev) => { salvarScroll(); const novaProf = html.find('.select-new-profession').val(); if (!profissoesAtivas.includes(novaProf)) { profissoesAtivas.push(novaProf); await actor.setFlag("professions-reworked-5e", "profissoesAtivas", profissoesAtivas); } });
    html.find('.delete-project').click(async (ev) => { salvarScroll(); const card = ev.currentTarget.closest('.project-card'); const index = card.dataset.index; if (index !== undefined && listaProjetos[index]) { const proj = listaProjetos[index]; const confirm = await Dialog.confirm({ title: "Excluir", content: `<p>Excluir <strong>${proj.nome}</strong>?</p>` }); if (confirm) { manterAbaAberta = true; listaProjetos.splice(index, 1); await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos); } else { manterAbaAberta = false; } } else { manterAbaAberta = false; } });
    
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
        if (subTipo === "Preparo para Encantamento") { if (!valorRaridadePreparo) { ui.notifications.warn("Selecione a Raridade do Encanto!"); manterAbaAberta = false; return; } raridadeSalva = valorRaridadePreparo; if (PREPARO_ENCANTAMENTO[raridadeSalva] && PREPARO_ENCANTAMENTO[raridadeSalva][valorComplexidade]) { acertosTotaisPreparo = PREPARO_ENCANTAMENTO[raridadeSalva][valorComplexidade]; } else { acertosTotaisPreparo = 10; } dificuldadeOverride = "Muito Difícil"; }
        if (prof === "Herbalista") { if (!valorBioma) { ui.notifications.warn("Selecione o Bioma!"); manterAbaAberta = false; return; } biomaSalvo = valorBioma; let chaveMatriz = "padrao"; let metaAcertos = "Simples"; if (subTipo === "Tintura Mágica") { if (!valorRaridadePreparo) { ui.notifications.warn("Selecione a Raridade!"); manterAbaAberta = false; return; } raridadeSalva = valorRaridadePreparo; if (raridadeSalva === "Comum") { chaveMatriz = "comum"; metaAcertos = "Simples"; } if (raridadeSalva === "Incomum") { chaveMatriz = "incomum"; metaAcertos = "Moderadamente Complexo"; } if (raridadeSalva === "Raro") { chaveMatriz = "raro"; metaAcertos = "Complexo"; } if (raridadeSalva === "Muito Raro") { chaveMatriz = "muito_raro"; metaAcertos = "Muito Complexo"; } if (raridadeSalva === "Lendário") { chaveMatriz = "lendario"; metaAcertos = "Muito Complexo"; } } else if (subTipo === "Erva de Poção") { chaveMatriz = "uva"; metaAcertos = HERBALISTA_META["Erva de Poção"]; } else { chaveMatriz = "padrao"; metaAcertos = HERBALISTA_META[subTipo] || "Simples"; } valorComplexidade = metaAcertos; dificuldadeOverride = HERBALISTA_MATRIZ[chaveMatriz][biomaSalvo]; if (!dificuldadeOverride) { ui.notifications.error("Erro: Bioma inválido para esta raridade!"); manterAbaAberta = false; return; } }
        if (prof === "Joalheiro") { if (subTipo === "Gema Lapidada") { if (!valorGemaRaridade) { ui.notifications.warn("Selecione a Raridade da Gema!"); manterAbaAberta = false; return; } if (valorGemaPC <= 0) { ui.notifications.warn("Insira um Valor inicial válido!"); manterAbaAberta = false; return; } raridadeSalva = valorGemaRaridade; valorAtual = valorGemaPC; const configGema = JOALHEIRO_GEMA[raridadeSalva]; if (configGema) { valorComplexidade = configGema.complexidade; } } else if (subTipo === "Encrustar Gemas para Encantamento") { if (!valorRaridadePreparo) { ui.notifications.warn("Selecione a Raridade do Item!"); manterAbaAberta = false; return; } raridadeSalva = valorRaridadePreparo; const configEncrustar = JOALHEIRO_ENCRUSTAR[raridadeSalva]; if (configEncrustar) { dificuldadeOverride = configEncrustar.dificuldade; valorComplexidade = "Complexo"; } } }
        if (prof === "Sicário") { if (subTipo === "Veneno Básico") { valorComplexidade = "Simples"; } else if (subTipo === "Veneno Avançado") { valorComplexidade = "Moderadamente Complexo"; } else if (subTipo === "Veneno de Dragão Verde") { if (!valorIdadeDragao) { ui.notifications.warn("Selecione a Idade do Dragão!"); manterAbaAberta = false; return; } idadeDragaoSalva = valorIdadeDragao; const configDragao = SICARIO_DRAGAO[valorIdadeDragao]; if (configDragao) { dificuldadeOverride = configDragao.dificuldade; valorComplexidade = "Complexo"; } } else if (subTipo === "Coleta de Veneno de Monstro") { if (!valorTipoVeneno) { ui.notifications.warn("Selecione o Tipo de Veneno!"); manterAbaAberta = false; return; } tipoVenenoColetaSalva = valorTipoVeneno; const configColeta = SICARIO_COLETA_DIFF[valorTipoVeneno]; if (configColeta) { dificuldadeOverride = configColeta.dificuldade; valorComplexidade = "Simples"; } } else if (subTipo === "Coleta de Erva Venenosa") { if (!valorTipoErva) { ui.notifications.warn("Selecione o Tipo de Erva!"); manterAbaAberta = false; return; } tipoErvaSalva = valorTipoErva; if (valorTipoErva === "Veneno Básico") { valorComplexidade = "Simples"; } else if (valorTipoErva === "Veneno Avançado") { valorComplexidade = "Moderadamente Complexo"; } } }
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
            fase: faseCartografo 
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
        if (!projeto) { manterAbaAberta = false; return; }

        if (projeto.subTipo === "Gema Lapidada" && projeto.valorAtual <= 0) {
            ui.notifications.warn("Esta gema está quebrada e não pode mais ser trabalhada.");
            manterAbaAberta = false;
            return;
        }

        const attributeKey = projeto.atributoPadrao || "int";
        const hasAdvantage = projeto.usoVantagem || false;
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
        if (!hasTool) {
            if (!hasAdvantage) diceFormula = "2d20kl1"; 
        } else {
            if (hasAdvantage) diceFormula = "2d20kh1"; 
        }

        let formula = `${diceFormula} + ${attrMod}[${attrLabel}]`;
        if (profBonus > 0) formula += ` + ${profBonus}[Prof]`;
        if (situationalBonus) formula += ` + ${situationalBonus}[Sit]`;

        try {
            const r = new Roll(formula, actor.getRollData());
            await r.evaluate();

            let diffAlvo = projeto.dificuldadeEspecifica || COMPLEXIDADE_PROJETO[projeto.complexidade].dificuldade;
            
            if (projeto.profissao === "Cartógrafo" && projeto.fase === "rascunho") {
                if (!projeto.bioma) {
                    ui.notifications.warn("Selecione o Bioma no card do projeto!");
                    manterAbaAberta = false;
                    return;
                }
                diffAlvo = CARTOGRAFO_BIOMA_DIFF[projeto.bioma];
            } else if (projeto.profissao === "Cartógrafo" && projeto.fase === "definitivo") {
                diffAlvo = "Difícil";
            }

            const res = calcularResultado(r.total, diffAlvo);
            
            if (projeto.subTipo === "Coleta de Veneno de Monstro") {
                const formulaDoses = SICARIO_DOSES[res.resultado];
                if (formulaDoses === "0") {
                    projeto.resultadoColeta = "Nenhuma dose coletada.";
                } else {
                    const rollDoses = new Roll(formulaDoses);
                    await rollDoses.evaluate();
                    projeto.resultadoColeta = `${rollDoses.total} Doses (${formulaDoses})`;
                }
                
                projeto.isConcluido = true; 
                await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);

                r.toMessage({
                    speaker: ChatMessage.getSpeaker({actor}),
                    flavor: `
                        <div style="font-size:13px">
                            <strong>Coleta de Veneno: ${projeto.tipoVenenoColeta}</strong><br>
                            Teste: <b>${r.total}</b> (${res.resultado})<br>
                            <span style="color:#4b0082; font-weight:bold">${projeto.resultadoColeta}</span>
                        </div>
                    `
                });
                return; 
            }

            if (projeto.profissao === "Cartógrafo" && projeto.fase === "rascunho") {
                const incremento = CARTOGRAFO_RASCUNHO_INC[res.resultado] || 0;
                if (!projeto.totalNecessario) projeto.totalNecessario = 0;
                projeto.totalNecessario += incremento;
                
                r.toMessage({
                    speaker: ChatMessage.getSpeaker({actor}),
                    flavor: `
                        <div style="font-size:13px">
                            <strong>Desenhando Rascunho (${projeto.bioma})</strong><br>
                            Ferramenta: ${toolLabel}<br>
                            Resultado: <b>${res.resultado}</b><br>
                            Meta aumentada em: <b>+${incremento}</b> (Total: ${projeto.totalNecessario})
                        </div>
                    `
                });
            } else {
                let metaAcertos = 0;
                let msgDano = "";

                if (projeto.profissao === "Cartógrafo" && projeto.fase === "definitivo" && isExpertise) {
                    res.acertos *= 2;
                    msgDano += `<br><span style="color:#006400; font-weight:bold;">Expertise! Progresso dobrado!</span>`;
                }

                if (projeto.profissao === "Cartógrafo" && projeto.fase === "definitivo") {
                    metaAcertos = projeto.totalNecessario;
                }
                else if (projeto.acertosTotaisPreparo) {
                    metaAcertos = projeto.acertosTotaisPreparo;
                }
                else {
                    const compConfig = COMPLEXIDADE_PROJETO[projeto.complexidade];
                    metaAcertos = compConfig ? compConfig.acertosNecessarios : 100;
                }

                projeto.acertosAtuais += res.acertos;
                if (projeto.acertosAtuais > metaAcertos) {
                    projeto.acertosAtuais = metaAcertos;
                }

                const key = res.resultado.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join('');
                const labelResultado = game.i18n.localize(`PROFESSIONS.Results.${key}`);
                
                if (projeto.subTipo === "Gema Lapidada") {
                    if (res.resultado === "ALTA_FALHA" || res.resultado === "GRANDE_FALHA") {
                        const danoRoll = new Roll("1d4");
                        await danoRoll.evaluate();
                        const dano = danoRoll.total;
                        projeto.valorAtual -= dano;
                        if (projeto.valorAtual <= 0) projeto.valorAtual = 0; 
                        msgDano += `<br><span style="color:red; font-weight:bold;">Dano na Gema: -${dano} PC! (Valor Atual: ${projeto.valorAtual})</span>`;
                        if (projeto.valorAtual === 0) msgDano += `<br><strong>A GEMA QUEBROU!</strong>`;
                    }
                }

                r.toMessage({
                    speaker: ChatMessage.getSpeaker({actor}),
                    flavor: `
                        <div style="font-size:13px">
                            <strong>Trabalhando: ${projeto.nome}</strong><br>
                            Ferramenta: ${toolLabel}<br>
                            Resultado: <b>${labelResultado}</b> (+${res.acertos})
                            ${msgDano}
                        </div>
                    `
                });
            }

            await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);

        } catch (err) {
            ui.notifications.error("Erro na fórmula: " + err.message);
            manterAbaAberta = false;
        }
    });
});
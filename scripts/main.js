import { calcularResultado, processarCozinheiro } from './logic.js';
import { COMPLEXIDADE_PROJETO } from './constants.js';

Hooks.once("init", () => {
    console.log("Profissões Dinâmicas | Inicializando sistema...");
});

Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
    const actor = app.actor;

    // 1. BUSCAR LISTA DE PROJETOS (ARRAY)
    // Se não existir, iniciamos um array vazio []
    let listaProjetos = actor.getFlag("professions-reworked-5e", "projetos") || [];

    // 2. PREPARAR DADOS PARA O HTML
    // Calculamos a porcentagem de cada projeto antes de enviar para o .hbs
    const projetosRender = listaProjetos.map(p => {
        const config = COMPLEXIDADE_PROJETO[p.complexidade];
        return {
            ...p,
            totalNecessario: config.acertosNecessarios,
            porcentagem: Math.min((p.acertosAtuais / config.acertosNecessarios) * 100, 100)
        };
    });

    // Injetar a aba
    const tabs = html.find('.sheet-navigation.tabs');
    tabs.append($('<a class="item" data-tab="professions">Profissões</a>'));

    // Renderizar passando a lista de projetos
    const templatePath = "modules/professions-reworked-5e/templates/professions-tab.hbs";
    const myTabHtml = await renderTemplate(templatePath, { projetos: projetosRender });
    html.find('.sheet-body').append(myTabHtml);

    // --- OUVINTES DE EVENTO ---

    // A. CRIAR NOVO PROJETO
    html.find('.create-project-btn').click(async (ev) => {
        const nome = html.find('.new-project-name').val();
        const complexidade = html.find('.new-project-complexity').val();

        if (!nome) return ui.notifications.warn("Dê um nome ao seu projeto!");

        const novoProjeto = {
            nome: nome,
            complexidade: complexidade,
            acertosAtuais: 0
        };

        listaProjetos.push(novoProjeto);
        await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);
        ui.notifications.info(`Projeto "${nome}" iniciado!`);
    });

    // B. EXCLUIR PROJETO
    html.find('.delete-project').click(async (ev) => {
        const index = ev.currentTarget.closest('.project-card').dataset.projectId;
        listaProjetos.splice(index, 1); // Remove o item do array
        await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);
    });

    // C. TRABALHAR EM UM PROJETO
    html.find('.roll-profession-test').click(async (ev) => {
        const index = ev.currentTarget.dataset.projectId;
        const projeto = listaProjetos[index];
        const config = COMPLEXIDADE_PROJETO[projeto.complexidade];

        const rolagem = await dnd5e.dice.d20Roll({
            parts: ["@mod", "@prof"],
            data: actor.getRollData(),
            title: `Trabalhando em: ${projeto.nome}`,
            chooseModifier: true
        });

        if (!rolagem) return;

        const resultado = calcularResultado(rolagem.total, config.dificuldade);
        projeto.acertosAtuais += resultado.acertos;

        await actor.setFlag("professions-reworked-5e", "projetos", listaProjetos);
    });

    // D. COZINHEIRO (Lógica permanece a mesma)
    html.find('.cook-test').click(async (ev) => {
        const tipoPreparo = ev.currentTarget.dataset.type;
        const rolagem = await dnd5e.dice.d20Roll({
            parts: ["@mod", "@prof"],
            data: actor.getRollData(),
            title: `Cozinhar: ${tipoPreparo}`,
            chooseModifier: true
        });

        if (!rolagem) return;
        const resultadoCozinha = processarCozinheiro(rolagem.total, tipoPreparo);

        if (tipoPreparo === "BANQUETE" && resultadoCozinha.efeitoFinal !== "0") {
            let rollPV = new Roll(resultadoCozinha.efeitoFinal, actor.getRollData());
            await rollPV.evaluate();
            rollPV.toMessage({ flavor: `<b>Banquete:</b> PV Temporários!` });
        } else {
            // Mensagem de qualidade...
            ui.notifications.info(`Qualidade da Refeição: ${resultadoCozinha.efeitoFinal}`);
        }
    });
});
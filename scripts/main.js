import { calcularResultado, processarCozinheiro } from './logic.js';
import { COMPLEXIDADE_PROJETO } from './constants.js';

Hooks.once("init", () => {
    console.log("Profissões Dinâmicas | Inicializando sistema...");
});

Hooks.on("renderActorSheet5eCharacter", async (app, html, data) => {
    const actor = app.actor;

    // 1. Dados do Projeto Ativo (Flags)
    const projetoAtivo = actor.getFlag("professions-reworked-5e", "projetoAtivo") || {
        nome: "Nenhum Projeto",
        complexidade: "Simples",
        acertosAtuais: 0
    };

    const configComplexidade = COMPLEXIDADE_PROJETO[projetoAtivo.complexidade];
    const totalNecessario = configComplexidade.acertosNecessarios;
    const porcentagem = Math.min((projetoAtivo.acertosAtuais / totalNecessario) * 100, 100);

    const profData = {
        projeto: projetoAtivo,
        totalNecessario: totalNecessario,
        porcentagem: porcentagem
    };

    // 2. Injetar a Aba
    const tabs = html.find('.sheet-navigation.tabs');
    tabs.append($('<a class="item" data-tab="professions">Profissões</a>'));

    const templatePath = "modules/professions-reworked-5e/templates/professions-tab.hbs";
    const myTabHtml = await renderTemplate(templatePath, profData);
    html.find('.sheet-body').append(myTabHtml);

   // 3. OUVINTE: Realizar Trabalho (Projetos)
    html.find('.roll-profession-test').click(async (ev) => {
        ev.preventDefault();

        // Chamamos o diálogo de rolagem oficial do sistema D&D 5e
        const rolagem = await dnd5e.dice.d20Roll({
            parts: ["@mod", "@prof"], // Modificador de Atributo + Proficiência
            data: actor.getRollData(), // Pega os dados automáticos do personagem
            title: `Teste de Profissão: ${projetoAtivo.nome}`,
            flavor: `Trabalhando em: ${projetoAtivo.nome}`,
            chooseModifier: true // PERMITE escolher For, Des, Int, etc. no diálogo!
        });

        // Se o jogador fechar o diálogo sem rolar, interrompemos aqui
        if (!rolagem) return;

        const resultado = calcularResultado(rolagem.total, configComplexidade.dificuldade);
        const novoTotal = projetoAtivo.acertosAtuais + resultado.acertos;

        await actor.setFlag("professions-reworked-5e", "projetoAtivo", {
            ...projetoAtivo,
            acertosAtuais: novoTotal
        });

        ui.notifications.info(`Você obteve ${resultado.acertos} acertos!`);
    });

    // 4. OUVINTE: Cozinheiro (Refeições)
    html.find('.cook-test').click(async (ev) => {
        ev.preventDefault();
        const tipoPreparo = ev.currentTarget.dataset.type;

        // Abrimos o diálogo oficial para o Cozinheiro também
        const rolagem = await dnd5e.dice.d20Roll({
            parts: ["@mod", "@prof"],
            data: actor.getRollData(),
            title: `Teste de Cozinheiro: ${tipoPreparo}`,
            chooseModifier: true
        });

        if (!rolagem) return;

        const resultadoCozinha = processarCozinheiro(rolagem.total, tipoPreparo);

        if (tipoPreparo === "BANQUETE" && resultadoCozinha.efeitoFinal !== "0") {
            let rollPV = new Roll(resultadoCozinha.efeitoFinal, actor.getRollData());
            await rollPV.evaluate();
            rollPV.toMessage({
                flavor: `<b>Banquete:</b> ${resultadoCozinha.resultadoMatematico}<br>PV Temporários concedidos!`
            });
        } else {
            ChatMessage.create({
                user: game.user._id,
                speaker: ChatMessage.getSpeaker({actor: actor}),
                content: `
                    <div class="dice-roll dnd5e">
                        <div class="dice-result">
                            <div class="dice-formula">Teste de Cozinheiro (${tipoPreparo})</div>
                            <div class="dice-total">${rolagem.total}</div>
                            <div class="dice-tooltip">Resultado: ${resultadoCozinha.resultadoMatematico}</div>
                            <h4 class="dice-total" style="color: #4b0082">Qualidade: ${resultadoCozinha.efeitoFinal}</h4>
                        </div>
                    </div>`
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // --- Lógica de Filtragem de Projetos ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' de todos os botões e adiciona ao clicado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            projectCards.forEach(card => {
                const tech = card.dataset.tech;
                if (filter === 'all' || tech.includes(filter)) {
                    card.style.display = 'flex'; // Mostra o card
                    card.style.animation = 'none'; // Reseta animação para mostrar
                    card.offsetHeight; // Força reflow para aplicar o display antes da animação
                    card.style.animation = 'fadeInUp 0.8s ease forwards';
                } else {
                    card.style.display = 'none'; // Esconde o card
                }
            });
        });
    });

    // --- Lógica do Modal (Pop-up) ---
    const modal = document.getElementById('project-modal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-full-description');
    const modalGallery = document.getElementById('modal-gallery');
    const modalTech = document.getElementById('modal-tech');
    const modalGithubLink = document.getElementById('modal-github-link');
    const modalDemoLink = document.getElementById('modal-demo-link');

    // Dados dos projetos para o modal (você pode carregar isso de um JSON no futuro)
    const projectsData = {
        "fila": {
            title: "Fila (em andamento)",
            description: "Mini plataforma de venda de ingressos construída como microsserviços orientados a eventos, para praticar sistemas distribuídos do jeito certo. Os serviços em Laravel conversam via RabbitMQ, e o fluxo de compra usa o padrão Saga com compensação (reservar → pagar → confirmar ou desfazer). Roda na Azure Container Apps com escala automática pelo tamanho da fila (KEDA), infraestrutura como código com Terraform, CI/CD com GitHub Actions + OIDC (sem segredo guardado) e observabilidade com OpenTelemetry + Grafana.",
            tech: ["Laravel", "RabbitMQ", "Azure Container Apps", "KEDA", "Terraform", "GitHub Actions", "OpenTelemetry"],
            github: null,
            demo: null,
            images: []
        },
        "noxis": {
            title: "Noxis",
            description: "Sistema de indexação e busca de arquivos de alto desempenho, construído com FastAPI. Indexa metadados para busca rápida, usa SQLite FTS5 para busca de texto completo, monitora o sistema (CPU, RAM e disco) e valida o tratamento de arquivos com segurança.",
            tech: ["Python", "FastAPI", "SQLite FTS5"],
            github: "https://github.com/janailsonf-a/Noxis-Python",
            demo: null,
            images: []
        },
        "central-desk": {
            title: "Central Desk",
            description: "Sistema de help desk para gestão de chamados e solicitações internas, construído com Laravel. Tem autenticação, interface web e API para integração com outros sistemas.",
            tech: ["Laravel", "PHP", "API REST"],
            github: "https://github.com/janailsonf-a/Central-Desk",
            demo: null,
            images: []
        },
        "termohigrometro": {
            title: "IoT Termohigrômetro",
            description: "Projeto de Internet das Coisas para monitorar a temperatura e a umidade de ambientes onde ficam armazenados medicamentos. Um ESP32 lê os sensores e acompanha as condições do ambiente, que precisam ficar dentro de faixas seguras para preservar os remédios.",
            tech: ["IoT", "ESP32", "Sensores"],
            github: null,
            demo: null,
            images: []
        },
        "mini-erp": {
            title: "Mini ERP",
            description: "O Mini ERP é um sistema de gestão completo e funcional para pequenas operações de e-commerce, desenvolvido do zero para controlar de forma integrada as principais rotinas de uma loja virtual: produtos, estoque, pedidos e promoções. O projeto foi concebido como um desafio técnico para aplicar e demonstrar habilidades em desenvolvimento backend com PHP Puro, seguindo as melhores práticas de mercado.",
            tech: ["PHP", "MySQL", "JavaScript"],
            github: "https://github.com/janailsonf-a/mini-erp-php.git",
            demo: null, // Se não tiver demo, use null
            images: ["img/miniErp.png"]
        },
        "porquinho-turbo": {
            title: "Porquinho Turbo",
            description: "O Porquinho Turbo é uma aplicação web completa para gerenciamento de finanças pessoais, desenvolvida para oferecer aos usuários um controle intuitivo e visual de suas receitas e despesas. O sistema foi construído com uma abordagem full-stack, combinando o poder do Laravel no backend com a flexibilidade do Blade no frontend, resultando em uma ferramenta robusta e fácil de usar.",
            tech: ["Laravel (PHP)"],
            github: "https://github.com/janailsonf-a/Porquinho-Turbo.git",
            demo: null,
            images: ["img/porquinho.png"]
        },
        "anexa-facil": {
            title: "Anexa Fácil",
            description: "O Anexa Fácil é uma aplicação web full-stack desenvolvida para automatizar e otimizar a tarefa de unificar boletos em PDF e seus respectivos comprovantes de pagamento em imagem. O objetivo é transformar um processo manual e demorado em uma solução rápida, profissional e inteligente.",
            tech: ["React.js", "Flask (Python)", "Tailwind CSS"],
            github: "https://github.com/janailsonf-a/anexa-facil.git",
            demo: "https://anexa-facil.vercel.app/",
            images: ["img/anexaFacil.png"]
        }
        // Adicione mais dados de projetos aqui, com IDs correspondentes ao 'data-project-id' no HTML
    };

    projectCards.forEach(card => {
        const detailButton = card.querySelector('.btn-detail');
        if (detailButton) {
            detailButton.addEventListener('click', (e) => {
                e.preventDefault(); // Impede o link de navegar
                const projectId = detailButton.dataset.projectId;
                const project = projectsData[projectId];

                if (project) {
                    modalTitle.textContent = project.title;
                    modalDescription.textContent = project.description;

                    // Limpa tecnologias e adiciona novas
                    modalTech.innerHTML = '';
                    project.tech.forEach(techName => {
                        const span = document.createElement('span');
                        span.textContent = techName;
                        modalTech.appendChild(span);
                    });

                    // Limpa galeria e adiciona imagens
                    modalGallery.innerHTML = '';
                    if (project.images && project.images.length > 0) {
                        project.images.forEach(imageSrc => {
                            const img = document.createElement('img');
                            img.src = imageSrc;
                            img.alt = `Imagem do projeto ${project.title}`;
                            modalGallery.appendChild(img);
                        });
                    }

                    // Configura links
                    if (project.github) {
                        modalGithubLink.href = project.github;
                        modalGithubLink.style.display = 'inline-block';
                    } else {
                        modalGithubLink.style.display = 'none';
                    }
                    if (project.demo) {
                        modalDemoLink.href = project.demo;
                        modalDemoLink.style.display = 'inline-block';
                    } else {
                        modalDemoLink.style.display = 'none';
                    }

                    modal.style.display = 'block';
                    document.body.classList.add('no-scroll'); // Trava rolagem
                }
            });
        }
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll'); // Destrava rolagem
    });

    // Fecha o modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }
    });
});
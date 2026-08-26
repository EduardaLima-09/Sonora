import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CadastrarMusica.module.css";
import Notas from "../componentes/Notas";

// Imagem - Logo
import logo from "../assets/LogoSomenteIconeCortada.png";

// Importando ícones do react-icons
import {
    FiHome,
    FiPlus,
    FiLogOut,
    FiMusic,
    FiHeart,
    FiTrash2,
    FiEdit,
    FiSave,
    FiX,
    FiUpload,
    FiClock,
    FiUser,
    FiDisc,
    FiTag,
    FiMessageCircle,
    FiFeather
} from "react-icons/fi";

function CadastrarMusica() {
    const usuario = "du4ards_";

    // ============================
    // ESTADO DO FORMULÁRIO
    // ============================
    const [formData, setFormData] = useState({
        nome: "",
        artista: "",
        album: "",
        genero: "",
        duracao: "00:00",
        capa: null,
        favorita: false,
        anotacao: ""
    });

    // ============================
    // LISTA DE MÚSICAS CADASTRADAS
    // ============================
    const [musicas, setMusicas] = useState([
        {
            id: 1,
            nome: "Mal de Amor",
            artista: "Mano Brown, Lino Krizz",
            album: "Boogie Naïpe - Soul",
            genero: "Soul",
            duracao: "04:38",
            favorita: true,
            capa: null,
            notas: [
                {
                    id: 1,
                    texto: "Essa música me lembra do meu primeiro amor. A gente ouvia juntos no carro.",
                    criadoEm: "2024-01-15T10:30:00"
                },
                {
                    id: 2,
                    texto: "A letra é tão profunda, cada vez que ouço descubro algo novo.",
                    criadoEm: "2024-01-16T14:20:00"
                }
            ]
        },
        {
            id: 2,
            nome: "Cigana",
            artista: "Jorge Ben Jor",
            album: "A Tábua de Esmeralda",
            genero: "MPB",
            duracao: "03:45",
            favorita: true,
            capa: null,
            notas: [
                {
                    id: 3,
                    texto: "Minha avó adorava essa música. Toda vez que ouço, lembro dela.",
                    criadoEm: "2024-01-17T09:15:00"
                }
            ]
        },
        {
            id: 3,
            nome: "Palco",
            artista: "Gilberto Gil",
            album: "Realce",
            genero: "MPB",
            duracao: "04:12",
            favorita: false,
            capa: null,
            notas: []
        }
    ]);

    // ============================
    // ESTADOS AUXILIARES
    // ============================
    const [editandoId, setEditandoId] = useState(null);
    const [erro, setErro] = useState("");
    const [notasAbertas, setNotasAbertas] = useState({});

    // ============================
    // LISTA DE GÊNEROS
    // ============================
    const generos = [
        "Selecionar",
        "MPB",
        "Rock",
        "Samba",
        "Pagode",
        "Funk",
        "Soul",
        "Jazz",
        "Blues",
        "Eletrônica",
        "Indie",
        "Alternativo",
        "Outro"
    ];

    // ============================
    // HANDLERS DO FORMULÁRIO
    // ============================

    // Quando o usuário digita em algum campo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Quando o usuário seleciona uma imagem
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setFormData({ ...formData, capa: reader.result });
            };

            reader.readAsDataURL(file);
        }
    };

    // Quando o usuário envia o formulário
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação: nome e artista são obrigatórios
        if (!formData.nome || !formData.artista) {
            setErro("Preencha pelo menos o nome da música e o artista.");
            return;
        }

        setErro("");

        // Cria o objeto da nova música
        const novaMusica = {
            id: editandoId || Date.now(),
            nome: formData.nome,
            artista: formData.artista,
            album: formData.album || "",
            genero: formData.genero || "",
            duracao: formData.duracao || "00:00",
            favorita: formData.favorita || false,
            capa: formData.capa || null,
            notas: formData.anotacao
                ? [
                    {
                        id: Date.now(),
                        texto: formData.anotacao,
                        criadoEm: new Date().toISOString()
                    }
                ]
                : []
        };

        // Se estiver editando
        if (editandoId) {
            const musicaExistente = musicas.find((m) => m.id === editandoId);
            const notasExistentes = musicaExistente?.notas || [];

            const notasAtualizadas = formData.anotacao
                ? [
                    ...notasExistentes,
                    {
                        id: Date.now(),
                        texto: formData.anotacao,
                        criadoEm: new Date().toISOString()
                    }
                ]
                : notasExistentes;

            setMusicas(
                musicas.map((m) =>
                    m.id === editandoId
                        ? { ...novaMusica, id: m.id, notas: notasAtualizadas }
                        : m
                )
            );

            setEditandoId(null);
        } else {
            // Se for uma nova música
            setMusicas([...musicas, novaMusica]);
        }

        // Limpa o formulário
        setFormData({
            nome: "",
            artista: "",
            album: "",
            genero: "",
            duracao: "00:00",
            capa: null,
            favorita: false,
            anotacao: ""
        });
    };

    // Quando o usuário clica em editar
    const handleEdit = (musica) => {
        setFormData({
            nome: musica.nome,
            artista: musica.artista,
            album: musica.album || "",
            genero: musica.genero || "",
            duracao: musica.duracao || "00:00",
            capa: musica.capa || null,
            favorita: musica.favorita || false,
            anotacao: ""
        });

        setEditandoId(musica.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Quando o usuário clica em deletar
    const handleDelete = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta música?")) {
            setMusicas(musicas.filter((m) => m.id !== id));
        }
    };

    // Quando o usuário clica em favoritar
    const handleFavoritar = (id) => {
        setMusicas(
            musicas.map((m) =>
                m.id === id ? { ...m, favorita: !m.favorita } : m
            )
        );
    };

    // Quando o usuário cancela a edição
    const cancelarEdicao = () => {
        setEditandoId(null);
        setFormData({
            nome: "",
            artista: "",
            album: "",
            genero: "",
            duracao: "00:00",
            capa: null,
            favorita: false,
            anotacao: ""
        });
        setErro("");
    };

    // ============================
    // FUNÇÕES DAS ANOTAÇÕES
    // ============================

    // Abrir/fechar anotações de uma música
    const toggleNotas = (musicaId) => {
        setNotasAbertas((prev) => ({
            ...prev,
            [musicaId]: !prev[musicaId]
        }));
    };

    // ============================
    // RENDERIZAÇÃO
    // ============================

    return (
        <div className={styles.cadastrar}>
            {/* ===== SIDEBAR ===== */}
            <aside className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="Logo-Sonora" className={styles.logo} />
                </div>

                <nav className={styles.nav}>
                    <Link to="/home" className={styles.navItem}>
                        <FiHome className={styles.navIcon} />
                        <span>Início</span>
                    </Link>

                    <Link
                        to="/cadastrarMusica"
                        className={`${styles.navItem} ${styles.active}`}
                    >
                        <FiPlus className={styles.navIcon} />
                        <span>Cadastrar Música</span>
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>D</div>
                        <span className={styles.userName}>{usuario}</span>
                    </div>

                    <Link to="/" className={styles.logoutButton}>
                        <FiLogOut className={styles.navIcon} />
                        <span>Sair</span>
                    </Link>
                </div>
            </aside>

            {/* ===== CONTEÚDO PRINCIPAL ===== */}
            <main className={styles.main}>
                {/* ===== HEADER ===== */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>
                            {editandoId ? "Editando Música" : "Cadastrar nova música"}
                        </h1>

                        <p className={styles.subtitle}>
                            Adicione uma música à sua coleção e mantenha suas memórias
                            musicais organizadas.
                        </p>
                    </div>
                </header>

                {/* ===== FORMULÁRIO ===== */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {erro && <span className={styles.error}>{erro}</span>}

                    <div className={styles.formGrid}>
                        {/* Lado esquerdo do formulário */}
                        <div className={styles.formLeft}>
                            {/* Nome da música */}
                            <div className={styles.field}>
                                <label htmlFor="nome">Nome da música</label>
                                <input
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    placeholder="Digite o nome da música"
                                />
                            </div>

                            {/* Artista */}
                            <div className={styles.field}>
                                <label htmlFor="artista">Artista</label>
                                <input
                                    id="artista"
                                    name="artista"
                                    type="text"
                                    value={formData.artista}
                                    onChange={handleChange}
                                    placeholder="Digite o nome do artista"
                                />
                            </div>

                            {/* Álbum */}
                            <div className={styles.field}>
                                <label htmlFor="album">Álbum</label>
                                <input
                                    id="album"
                                    name="album"
                                    type="text"
                                    value={formData.album}
                                    onChange={handleChange}
                                    placeholder="Digite o nome do álbum"
                                />
                            </div>

                            {/* Gênero + Duração */}
                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label htmlFor="genero">Gênero</label>
                                    <select
                                        id="genero"
                                        name="genero"
                                        value={formData.genero}
                                        onChange={handleChange}
                                    >
                                        {generos.map((g) => (
                                            <option
                                                key={g}
                                                value={g === "Selecionar" ? "" : g}
                                            >
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="duracao">Duração</label>
                                    <input
                                        id="duracao"
                                        name="duracao"
                                        type="text"
                                        value={formData.duracao}
                                        onChange={handleChange}
                                        placeholder="00:00"
                                    />
                                </div>
                            </div>

                            {/* Anotações */}
                            <div className={styles.field}>
                                <label htmlFor="anotacao">
                                    Anotações sobre a música
                                </label>

                                <textarea
                                    id="anotacao"
                                    name="anotacao"
                                    value={formData.anotacao}
                                    onChange={handleChange}
                                    placeholder="O que essa música significa para você?"
                                    className={styles.textarea}
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Lado direito do formulário - Capa */}
                        <div className={styles.formRight}>
                            <div className={styles.capaContainer}>
                                <label htmlFor="capa" className={styles.capaLabel}>
                                    {formData.capa ? (
                                        <img
                                            src={formData.capa}
                                            alt="Capa"
                                            className={styles.capaPreview}
                                        />
                                    ) : (
                                        <>
                                            <FiUpload className={styles.capaIcon} />
                                            <span>Adicionar imagem</span>
                                        </>
                                    )}
                                </label>

                                <input
                                    id="capa"
                                    name="capa"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className={styles.capaInput}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botões do formulário */}
                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={cancelarEdicao}
                            className={styles.cancelButton}
                        >
                            <FiX />
                            Cancelar
                        </button>

                        <button type="submit" className={styles.saveButton}>
                            <FiSave />
                            {editandoId ? "Atualizar" : "Salvar"}
                        </button>
                    </div>
                </form>

                {/* ===== LISTA DE MÚSICAS ===== */}
                <section className={styles.listaSection}>
                    <div className={styles.listaHeader}>
                        <h2>
                            Músicas Cadastradas
                        </h2>

                        <span className={styles.totalMusicas}>
                            {musicas.length} músicas
                        </span>
                    </div>

                    <div className={styles.listaMusicas}>
                        {musicas.length === 0 ? (
                            <p className={styles.emptyMessage}>
                                Nenhuma música cadastrada ainda.
                                Adicione sua primeira música!
                            </p>
                        ) : (
                            musicas.map((musica) => (
                                <div key={musica.id} className={styles.cardMusica}>
                                    {/* Capa da música */}
                                    <div className={styles.cardCapa}>
                                        {musica.capa ? (
                                            <img
                                                src={musica.capa}
                                                alt={musica.nome}
                                            />
                                        ) : (
                                            <FiMusic
                                                className={styles.cardCapaIcon}
                                            />
                                        )}
                                    </div>

                                    {/* Informações da música */}
                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.cardTitulo}>
                                                <h4>{musica.nome}</h4>

                                                <button
                                                    onClick={() =>
                                                        handleFavoritar(musica.id)
                                                    }
                                                    className={
                                                        styles.favoritarButton
                                                    }
                                                >
                                                    <FiHeart
                                                        className={
                                                            musica.favorita
                                                                ? styles
                                                                    .favoritoAtivo
                                                                : styles
                                                                    .favoritoInativo
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            <span className={styles.cardArtista}>
                                                {musica.artista}
                                            </span>
                                        </div>

                                        {/* Detalhes */}
                                        <div className={styles.cardDetalhes}>
                                            {musica.album && (
                                                <span className={styles.cardAlbum}>
                                                    <FiDisc />
                                                    {musica.album}
                                                </span>
                                            )}

                                            {musica.genero && (
                                                <span className={styles.cardGenero}>
                                                    <FiTag />
                                                    {musica.genero}
                                                </span>
                                            )}

                                            {musica.duracao && (
                                                <span className={styles.cardDuracao}>
                                                    <FiClock />
                                                    {musica.duracao}
                                                </span>
                                            )}
                                        </div>

                                        {/* Botão anotações */}
                                        <div className={styles.cardFooter}>
                                            <button
                                                onClick={() =>
                                                    toggleNotas(musica.id)
                                                }
                                                className={styles.notasButton}
                                            >
                                                <FiMessageCircle />
                                                {musica.notas?.length || 0} anotações
                                            </button>
                                        </div>

                                        {/* Componente Notas */}
                                        {notasAbertas[musica.id] && (
                                            <Notas
                                                musicas={musicas}
                                                setMusicas={setMusicas}
                                                musicaId={musica.id}
                                                onClose={() =>
                                                    toggleNotas(musica.id)
                                                }
                                            />
                                        )}
                                    </div>

                                    {/* Botões de ação */}
                                    <div className={styles.cardActions}>
                                        <button
                                            onClick={() => handleEdit(musica)}
                                            className={styles.editButton}
                                        >
                                            <FiEdit />
                                        </button>

                                        <button onClick={() => handleDelete(musica.id)} className={styles.deleteButton}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default CadastrarMusica;
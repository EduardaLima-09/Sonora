import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CadastrarMusica.module.css";

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
    FiTag
} from "react-icons/fi";

import logo from "../assets/LogoSomenteIconeCortada.png";

function CadastrarMusica() {
    const usuario = "du4ards_";

    // Estado do formulário
    const [formData, setFormData] = useState({
        nome: "",
        artista: "",
        album: "",
        genero: "",
        duracao: "00:00",
        capa: null,
        favorita: false
    });

    // Lista de músicas cadastradas
    const [musicas, setMusicas] = useState([
        {
            id: 1,
            nome: "Mal de Amor",
            artista: "Mano Brown, Lino Krizz",
            album: "Boogie Naïpe - Soul",
            genero: "Soul",
            duracao: "04:38",
            favorita: true,
            capa: null
        },
        {
            id: 2,
            nome: "Cigana",
            artista: "Jorge Ben Jor",
            album: "A Tábua de Esmeralda",
            genero: "MPB",
            duracao: "03:45",
            favorita: true,
            capa: null
        },
        {
            id: 3,
            nome: "Palco",
            artista: "Gilberto Gil",
            album: "Realce",
            genero: "MPB",
            duracao: "04:12",
            favorita: false,
            capa: null
        }
    ]);

    const [editandoId, setEditandoId] = useState(null);
    const [erro, setErro] = useState("");

    // Gêneros disponíveis
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

    // Handlers do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.artista) {
            setErro("Preencha pelo menos o nome da música e o artista.");
            return;
        }

        setErro("");

        if (editandoId) {
            // Editar
            setMusicas(musicas.map(m =>
                m.id === editandoId
                    ? { ...m, ...formData, id: m.id }
                    : m
            ));
            setEditandoId(null);
        } else {
            // Adicionar
            const novaMusica = {
                id: Date.now(),
                ...formData,
                favorita: false
            };
            setMusicas([...musicas, novaMusica]);
        }

        // Resetar formulário
        setFormData({
            nome: "",
            artista: "",
            album: "",
            genero: "",
            duracao: "00:00",
            capa: null,
            favorita: false
        });
    };

    const handleEdit = (musica) => {
        setFormData({
            nome: musica.nome,
            artista: musica.artista,
            album: musica.album || "",
            genero: musica.genero || "",
            duracao: musica.duracao || "00:00",
            capa: musica.capa || null,
            favorita: musica.favorita || false
        });
        setEditandoId(musica.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta música?")) {
            setMusicas(musicas.filter(m => m.id !== id));
        }
    };

    const handleFavoritar = (id) => {
        setMusicas(musicas.map(m =>
            m.id === id ? { ...m, favorita: !m.favorita } : m
        ));
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
        setFormData({
            nome: "",
            artista: "",
            album: "",
            genero: "",
            duracao: "00:00",
            capa: null,
            favorita: false
        });
        setErro("");
    };

    return (
        <div className={styles.cadastrar}>
            {/* SIDEBAR */}
            <aside className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="Sonora" className={styles.logo} />
                </div>

                <nav className={styles.nav}>
                    <Link to="/home" className={styles.navItem}>
                        <FiHome className={styles.navIcon} />
                        <span>Início</span>
                    </Link>
                    <Link to="/cadastrar-musica" className={`${styles.navItem} ${styles.active}`}>
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

            {/* CONTEÚDO PRINCIPAL */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>
                            {editandoId ? "Editando Música" : " Cadastrar nova música"}
                        </h1>
                        <p className={styles.subtitle}>
                            Adicione uma música à sua coleção e mantenha suas memórias musicais organizadas.
                        </p>
                    </div>
                </header>

                {/* FORMULÁRIO */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {erro && <span className={styles.error}>{erro}</span>}

                    <div className={styles.formGrid}>
                        <div className={styles.formLeft}>
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

                            <div className={styles.fieldRow}>
                                <div className={styles.field}>
                                    <label htmlFor="genero">Gênero</label>
                                    <select
                                        id="genero"
                                        name="genero"
                                        value={formData.genero}
                                        onChange={handleChange}
                                    >
                                        {generos.map(g => (
                                            <option key={g} value={g === "Selecionar" ? "" : g}>
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
                        </div>

                        <div className={styles.formRight}>
                            <div className={styles.capaContainer}>
                                <label htmlFor="capa" className={styles.capaLabel}>
                                    {formData.capa ? (
                                        <img src={formData.capa} alt="Capa" className={styles.capaPreview} />
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

                {/* LISTA DE MÚSICAS */}
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
                                Nenhuma música cadastrada ainda. Adicione sua primeira música!
                            </p>
                        ) : (
                            musicas.map((musica) => (
                                <div key={musica.id} className={styles.cardMusica}>
                                    <div className={styles.cardCapa}>
                                        {musica.capa ? (
                                            <img src={musica.capa} alt={musica.nome} />
                                        ) : (
                                            <FiMusic className={styles.cardCapaIcon} />
                                        )}
                                    </div>

                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardHeader}>
                                            <div className={styles.cardTitulo}>
                                                <h4>{musica.nome}</h4>
                                                <button
                                                    onClick={() => handleFavoritar(musica.id)}
                                                    className={styles.favoritarButton}
                                                >
                                                    <FiHeart className={musica.favorita ? styles.favoritoAtivo : styles.favoritoInativo} />
                                                </button>
                                            </div>
                                            <span className={styles.cardArtista}>
                                                <FiUser />
                                                {musica.artista}
                                            </span>
                                        </div>

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
                                    </div>

                                    <div className={styles.cardActions}>
                                        <button
                                            onClick={() => handleEdit(musica)}
                                            className={styles.editButton}
                                        >
                                            <FiEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(musica.id)}
                                            className={styles.deleteButton}
                                        >
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
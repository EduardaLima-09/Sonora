import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiClock,
    FiDisc,
    FiEdit,
    FiHeart,
    FiHome,
    FiLogOut,
    FiMessageCircle,
    FiMusic,
    FiPlus,
    FiSave,
    FiTag,
    FiTrash2,
    FiUpload,
    FiUser,
    FiX
} from "react-icons/fi";

import { api } from "../api/api";
import Loading from "../componentes/Loading";
import Notas from "../componentes/Notas";

import logo from "../assets/LogoSomenteIconeCortada.png";
import styles from "./CadastrarMusica.module.css";

function CadastrarMusica() {

    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    const usuario = usuarioSalvo?.usuario || "Visitante";
    const usuarioId = usuarioSalvo?.id;

    const formularioInicial = {
        nome: "",
        artista: "",
        album: "",
        genero: "",
        duracao: "00:00",
        capa: null,
        favorita: false,
        anotacao: ""
    };

    const [formData, setFormData] = useState(formularioInicial);
    const [musicas, setMusicas] = useState([]);

    const [editandoId, setEditandoId] = useState(null);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [carregandoLista, setCarregandoLista] = useState(true);

    const [notasAbertas, setNotasAbertas] = useState({});

    const generos = [
        "MPB",
        "Rock",
        "Samba",
        "Pagode",
        "Funk",
        "Soul",
        "R&B",
        "Pop",
        "Jazz",
        "Blues",
        "Eletrônica",
        "Indie",
        "Alternativo",
        "Trap",
        "Rap",
        "Hip-Hop"
    ];

    // ============================================================
    // DURAÇÃO
    // ============================================================

    const formatarDuracao = (segundos) => {

        if (!segundos || segundos <= 0) {
            return "00:00";
        }

        const minutos = Math.floor(segundos / 60);
        const segundosRestantes = segundos % 60;

        return `${String(minutos).padStart(2, "0")}:${String(
            segundosRestantes
        ).padStart(2, "0")}`;
    };

    const converterDuracao = (duracao) => {

        if (!duracao || duracao === "00:00") {
            return 0;
        }

        const partes = duracao.split(":");

        if (partes.length !== 2) {
            return 0;
        }

        const minutos = parseInt(partes[0], 10);
        const segundos = parseInt(partes[1], 10);

        if (isNaN(minutos) || isNaN(segundos)) {
            return 0;
        }

        return minutos * 60 + segundos;
    };

    // ============================================================
    // CARREGAR MÚSICAS
    // ============================================================

    const carregarMusicas = async () => {

        try {

            setCarregandoLista(true);
            setErro("");

            const dados = await api.getMusicas(usuarioId);

            const musicasComNotas = await Promise.all(
                dados.map(async (musica) => {

                    try {

                        const anotacoes = await api.getAnotacoes(
                            musica.id
                        );

                        return {
                            ...musica,
                            notas: anotacoes
                        };

                    } catch (erro) {

                        console.error(
                            "Erro ao carregar anotações:",
                            erro
                        );

                        return {
                            ...musica,
                            notas: []
                        };
                    }
                })
            );

            setMusicas(musicasComNotas);

            return musicasComNotas;

        } catch (erro) {

            console.error(
                "Erro ao carregar músicas:",
                erro
            );

            setErro(
                "Não foi possível carregar suas músicas."
            );

            return [];

        } finally {

            setCarregandoLista(false);
        }
    };

    useEffect(() => {

        if (usuarioId) {
            carregarMusicas();
        } else {
            setCarregandoLista(false);
        }

    }, [usuarioId]);

    // ============================================================
    // FORMULÁRIO
    // ============================================================

    const alterarCampo = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData((anterior) => ({
            ...anterior,
            [name]: type === "checkbox"
                ? checked
                : value
        }));
    };

    const alterarCapa = (e) => {

        const arquivo = e.target.files?.[0];

        if (!arquivo) {
            return;
        }

        const leitor = new FileReader();

        leitor.onloadend = () => {

            setFormData((anterior) => ({
                ...anterior,
                capa: leitor.result
            }));
        };

        leitor.readAsDataURL(arquivo);
    };

    const alternarFavorita = () => {

        setFormData((anterior) => ({
            ...anterior,
            favorita: !anterior.favorita
        }));
    };

    // ============================================================
    // SALVAR / ATUALIZAR
    // ============================================================

    const enviarFormulario = async (e) => {

        e.preventDefault();

        setErro("");
        setSucesso("");

        if (
            !formData.nome.trim() ||
            !formData.artista.trim() ||
            !formData.album.trim()
        ) {

            setErro(
                "Preencha nome, artista e álbum."
            );

            return;
        }

        setCarregando(true);

        try {

            const musicaParaEnviar = {
                nome: formData.nome.trim(),
                artista: formData.artista.trim(),
                album: formData.album.trim(),
                duracao: converterDuracao(formData.duracao),
                genero: formData.genero || "",
                favorita: formData.favorita || false,
                capa: formData.capa || "",
                usuarioId
            };

            let musicaSalva;

            // ATUALIZAR
            if (editandoId) {

                musicaSalva = await api.putMusica(
                    editandoId,
                    musicaParaEnviar
                );

                setSucesso(
                    "Música atualizada com sucesso!"
                );

            }

            // CADASTRAR
            else {

                musicaSalva = await api.postMusica(
                    musicaParaEnviar
                );

                setSucesso(
                    "Música cadastrada com sucesso!"
                );
            }

            // ====================================================
            // ANOTAÇÃO
            // ====================================================

            if (
                formData.anotacao.trim() &&
                musicaSalva?.id
            ) {

                try {

                    await api.postAnotacao({
                        texto: formData.anotacao.trim(),
                        musicaId: musicaSalva.id
                    });

                } catch (erroAnotacao) {

                    console.error(
                        "Música salva, mas houve erro ao salvar a anotação:",
                        erroAnotacao
                    );
                }
            }

            // Atualiza a lista
            await carregarMusicas();

            // Limpa formulário
            limparFormulario();

            setTimeout(() => {
                setSucesso("");
            }, 3000);

        } catch (erro) {

            console.error(
                "Erro ao salvar música:",
                erro
            );

            setErro(
                erro.message ||
                "Erro ao salvar música."
            );

            setTimeout(() => {
                setErro("");
            }, 3000);

        } finally {

            setCarregando(false);
        }
    };

    // ============================================================
    // EDITAR
    // ============================================================

    const editarMusica = (musica) => {

        setFormData({
            nome: musica.nome || "",
            artista: musica.artista || "",
            album: musica.album || "",
            genero: musica.genero || "",
            duracao: formatarDuracao(musica.duracao),
            capa: musica.capa || null,
            favorita: musica.favorita || false,
            anotacao: ""
        });

        setEditandoId(musica.id);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ============================================================
    // EXCLUIR
    // ============================================================

    const excluirMusica = async (id) => {

        const confirmar = window.confirm(
            "Tem certeza que deseja excluir esta música?"
        );

        if (!confirmar) {
            return;
        }

        try {

            await api.deleteMusica(
                id,
                usuarioId
            );

            await carregarMusicas();

            setSucesso(
                "Música excluída com sucesso!"
            );

            setTimeout(() => {
                setSucesso("");
            }, 3000);

        } catch (erro) {

            console.error(
                "Erro ao excluir música:",
                erro
            );

            setErro(
                erro.message ||
                "Erro ao excluir música."
            );

            setTimeout(() => {
                setErro("");
            }, 3000);
        }
    };

    // ============================================================
    // FAVORITAR
    // ============================================================

    const favoritarMusica = async (id) => {

        try {

            await api.patchFavoritar(
                id,
                usuarioId
            );

            await carregarMusicas();

        } catch (erro) {

            console.error(
                "Erro ao favoritar música:",
                erro
            );

            setErro(
                erro.message ||
                "Erro ao favoritar música."
            );

            setTimeout(() => {
                setErro("");
            }, 3000);
        }
    };

    // ============================================================
    // CANCELAR E LIMPAR
    // ============================================================

    const limparFormulario = () => {

        setFormData(formularioInicial);
        setEditandoId(null);
    };

    const cancelarEdicao = () => {

        limparFormulario();
        setErro("");
    };

    // ============================================================
    // ANOTAÇÕES
    // ============================================================

    const alternarNotas = (musicaId) => {

        setNotasAbertas((anterior) => ({
            ...anterior,
            [musicaId]: !anterior[musicaId]
        }));
    };

    // ============================================================
    // LOADING
    // ============================================================

    if (carregandoLista) {

        return (
            <Loading mensagem="Carregando suas músicas..." />
        );
    }

    // ============================================================
    // TELA
    // ============================================================

    return (

        <div className={styles.cadastrar}>

            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <aside className={styles.sidebar}>

                <div className={styles.logoContainer}>

                    <img
                        src={logo}
                        alt="Logo Sonora"
                        className={styles.logo}
                    />

                </div>

                <nav className={styles.nav}>

                    <Link
                        to="/home"
                        className={styles.navItem}
                    >
                        <FiHome className={styles.navIcon} />
                        <span>Início</span>
                    </Link>

                    <Link
                        to="/cadastrarMusica"
                        className={`${styles.navItem} ${styles.active}`}
                    >
                        <FiPlus className={styles.navIcon} />
                        <span>Música</span>
                    </Link>

                </nav>

                <div className={styles.sidebarFooter}>

                    <div className={styles.userInfo}>

                        <div className={styles.userAvatar}>
                            {usuario.charAt(0).toUpperCase()}
                        </div>

                        <span className={styles.userName}>
                            {usuario}
                        </span>

                    </div>

                    <Link
                        to="/"
                        className={styles.logoutButton}
                    >
                        <FiLogOut className={styles.navIcon} />

                        <span className={styles.logoutText}>
                            Sair
                        </span>
                    </Link>

                </div>

            </aside>

            {/* ==================================================
                CONTEÚDO PRINCIPAL
            ================================================== */}

            <main className={styles.main}>

                <header className={styles.header}>

                    <div className={styles.headerLeft}>

                        <h1 className={styles.title}>
                            {editandoId
                                ? "Editando Música"
                                : "Cadastrar nova música"}
                        </h1>

                        <p className={styles.subtitle}>
                            Adicione uma música à sua coleção
                            e mantenha suas memórias musicais
                            organizadas.
                        </p>

                    </div>

                </header>

                {/* ==================================================
                    MODAL DE ERRO
                ================================================== */}

                {erro && (

                    <div
                        className={styles.modalOverlay}
                        onClick={() => setErro("")}
                    >

                        <div
                            className={`${styles.modal} ${styles.modalError}`}
                            onClick={(e) => e.stopPropagation()}
                        >

                            <button
                                className={styles.modalClose}
                                onClick={() => setErro("")}
                            >
                                <FiX />
                            </button>

                            <h3 className={styles.modalTitle}>
                                Ops! Algo deu errado
                            </h3>

                            <p className={styles.modalMessage}>
                                {erro}
                            </p>

                            <button
                                className={styles.modalButtonError}
                                onClick={() => setErro("")}
                            >
                                Entendi
                            </button>

                        </div>

                    </div>
                )}

                {/* ==================================================
                    MODAL DE SUCESSO
                ================================================== */}

                {sucesso && (

                    <div
                        className={styles.modalOverlay}
                        onClick={() => setSucesso("")}
                    >

                        <div
                            className={`${styles.modal} ${styles.modalSuccess}`}
                            onClick={(e) => e.stopPropagation()}
                        >

                            <button
                                className={styles.modalClose}
                                onClick={() => setSucesso("")}
                            >
                                <FiX />
                            </button>

                            <h3 className={styles.modalTitle}>
                                Sucesso!
                            </h3>

                            <p className={styles.modalMessage}>
                                {sucesso}
                            </p>

                            <button
                                className={styles.modalButtonSuccess}
                                onClick={() => setSucesso("")}
                            >
                                Ok
                            </button>

                        </div>

                    </div>
                )}

                {/* ==================================================
                    FORMULÁRIO
                ================================================== */}

                <form
                    onSubmit={enviarFormulario}
                    className={styles.form}
                >

                    <div className={styles.formGrid}>

                        {/* ==============================
                            CAMPOS
                        ============================== */}

                        <div className={styles.formLeft}>

                            <div className={styles.field}>

                                <label htmlFor="nome">
                                    <FiMusic className={styles.fieldIcon} />
                                    Nome da música
                                </label>

                                <input
                                    id="nome"
                                    name="nome"
                                    type="text"
                                    value={formData.nome}
                                    onChange={alterarCampo}
                                    placeholder="Digite o nome da música"
                                />

                            </div>

                            <div className={styles.field}>

                                <label htmlFor="artista">
                                    <FiUser className={styles.fieldIcon} />
                                    Artista
                                </label>

                                <input
                                    id="artista"
                                    name="artista"
                                    type="text"
                                    value={formData.artista}
                                    onChange={alterarCampo}
                                    placeholder="Digite o nome do artista"
                                />

                            </div>

                            <div className={styles.field}>

                                <label htmlFor="album">
                                    <FiDisc className={styles.fieldIcon} />
                                    Álbum
                                </label>

                                <input
                                    id="album"
                                    name="album"
                                    type="text"
                                    value={formData.album}
                                    onChange={alterarCampo}
                                    placeholder="Digite o nome do álbum"
                                />

                            </div>

                            <div className={styles.fieldRow}>

                                <div className={styles.field}>

                                    <label htmlFor="genero">
                                        <FiTag className={styles.fieldIcon} />
                                        Gênero
                                    </label>

                                    <select
                                        id="genero"
                                        name="genero"
                                        value={formData.genero}
                                        onChange={alterarCampo}
                                    >

                                        <option value="">
                                            Selecione
                                        </option>

                                        {generos.map((genero) => (

                                            <option
                                                key={genero}
                                                value={genero}
                                            >
                                                {genero}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <div className={styles.field}>

                                    <label htmlFor="duracao">
                                        <FiClock className={styles.fieldIcon} />
                                        Duração
                                    </label>

                                    <input
                                        id="duracao"
                                        name="duracao"
                                        type="text"
                                        value={formData.duracao}
                                        onChange={alterarCampo}
                                        placeholder="00:00"
                                    />

                                </div>

                            </div>

                            {/* FAVORITA */}

                            <div className={styles.fieldFavorita}>

                                <div className={styles.favoritaLabel}>

                                    <span>
                                        <FiHeart className={styles.fieldIcon} />
                                        Marcar como favorita
                                    </span>

                                    <button
                                        type="button"
                                        onClick={alternarFavorita}
                                        className={styles.coracaoButton}
                                        aria-label={
                                            formData.favorita
                                                ? "Desmarcar favorita"
                                                : "Marcar como favorita"
                                        }
                                    >

                                        <FiHeart
                                            size={28}
                                            className={
                                                formData.favorita
                                                    ? styles.favoritoAtivo
                                                    : styles.favoritoInativo
                                            }
                                        />

                                    </button>

                                </div>

                            </div>

                            {/* ANOTAÇÃO */}

                            <div className={styles.field}>

                                <label htmlFor="anotacao">
                                    <FiMessageCircle
                                        className={styles.fieldIcon}
                                    />
                                    Anotações sobre a música
                                </label>

                                <textarea
                                    id="anotacao"
                                    name="anotacao"
                                    value={formData.anotacao}
                                    onChange={alterarCampo}
                                    placeholder="O que essa música significa para você?"
                                    className={styles.textarea}
                                    rows={4}
                                />

                            </div>

                        </div>

                        {/* ==============================
                            CAPA
                        ============================== */}

                        <div className={styles.formRight}>

                            <div className={styles.capaContainer}>

                                <label
                                    htmlFor="capa"
                                    className={styles.capaLabel}
                                >

                                    {formData.capa ? (

                                        <img
                                            src={formData.capa}
                                            alt="Prévia da capa"
                                            className={styles.capaPreview}
                                        />

                                    ) : (

                                        <>
                                            <FiUpload
                                                className={styles.capaIcon}
                                            />

                                            <span>
                                                Adicionar imagem
                                            </span>

                                            <span
                                                className={styles.capaSubtext}
                                            >
                                                Clique para fazer upload
                                            </span>
                                        </>

                                    )}

                                </label>

                                <input
                                    id="capa"
                                    name="capa"
                                    type="file"
                                    accept="image/*"
                                    onChange={alterarCapa}
                                    className={styles.capaInput}
                                />

                            </div>

                        </div>

                    </div>

                    {/* BOTÕES */}

                    <div className={styles.formActions}>

                        {editandoId && (

                            <button
                                type="button"
                                onClick={cancelarEdicao}
                                className={styles.cancelButton}
                            >
                                <FiX />
                                Cancelar
                            </button>

                        )}

                        <button
                            type="submit"
                            className={styles.saveButton}
                            disabled={carregando}
                        >

                            <FiSave />

                            {carregando
                                ? "Salvando..."
                                : editandoId
                                    ? "Atualizar"
                                    : "Salvar"}

                        </button>

                    </div>

                </form>

                {/* ==================================================
                    LISTA DE MÚSICAS
                ================================================== */}

                <section className={styles.listaSection}>

                    <div className={styles.listaHeader}>

                        <h2>
                            Músicas Cadastradas
                        </h2>

                        <span className={styles.totalMusicas}>
                            {musicas.length}{" "}
                            {musicas.length === 1
                                ? "música"
                                : "músicas"}
                        </span>

                    </div>

                    <div className={styles.listaMusicas}>

                        {musicas.length === 0 ? (

                            <div className={styles.emptyStateCadastro}>

                                <p className={styles.emptyStateMessage}>
                                    Você ainda não cadastrou
                                    nenhuma música.
                                </p>

                                <p className={styles.emptyStateSubMessage}>
                                    Preencha o formulário acima
                                    e comece a construir sua
                                    coleção musical!
                                </p>

                            </div>

                        ) : (

                            musicas.map((musica) => (

                                <div
                                    key={musica.id}
                                    className={styles.cardMusica}
                                >

                                    {/* CAPA */}

                                    <div className={styles.cardCapa}>

                                        {musica.capa ? (

                                            <img
                                                src={musica.capa}
                                                alt={`Capa de ${musica.nome}`}
                                            />

                                        ) : (

                                            <FiMusic
                                                className={styles.cardCapaIcon}
                                            />

                                        )}

                                    </div>

                                    {/* INFORMAÇÕES */}

                                    <div className={styles.cardInfo}>

                                        <div className={styles.cardHeader}>

                                            <div className={styles.cardTitulo}>

                                                <h4>
                                                    {musica.nome}
                                                </h4>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        favoritarMusica(
                                                            musica.id
                                                        )
                                                    }
                                                    className={
                                                        styles.favoritarButton
                                                    }
                                                    title={
                                                        musica.favorita
                                                            ? "Desfavoritar"
                                                            : "Favoritar"
                                                    }
                                                >

                                                    <FiHeart
                                                        size={20}
                                                        className={
                                                            musica.favorita
                                                                ? styles.favoritoAtivo
                                                                : styles.favoritoInativo
                                                        }
                                                    />

                                                </button>

                                            </div>

                                            <span
                                                className={
                                                    styles.cardArtista
                                                }
                                            >
                                                {musica.artista}
                                            </span>

                                        </div>

                                        {/* DETALHES */}

                                        <div
                                            className={
                                                styles.cardDetalhes
                                            }
                                        >

                                            {musica.album && (

                                                <span>
                                                    <FiDisc />
                                                    {musica.album}
                                                </span>

                                            )}

                                            {musica.genero && (

                                                <span>
                                                    <FiTag />
                                                    {musica.genero}
                                                </span>

                                            )}

                                            {musica.duracao > 0 && (

                                                <span>
                                                    <FiClock />
                                                    {formatarDuracao(
                                                        musica.duracao
                                                    )}
                                                </span>

                                            )}

                                        </div>

                                        {/* ANOTAÇÕES */}

                                        <div
                                            className={
                                                styles.cardFooter
                                            }
                                        >

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    alternarNotas(
                                                        musica.id
                                                    )
                                                }
                                                className={
                                                    styles.notasButton
                                                }
                                            >

                                                <FiMessageCircle />

                                                {musica.notas?.length || 0}

                                                {" "}

                                                {musica.notas?.length === 1
                                                    ? "anotação"
                                                    : "anotações"}

                                            </button>

                                        </div>

                                        {notasAbertas[musica.id] && (

                                            <Notas
                                                musicas={musicas}
                                                setMusicas={setMusicas}
                                                musicaId={musica.id}
                                                onClose={() =>
                                                    alternarNotas(
                                                        musica.id
                                                    )
                                                }
                                            />

                                        )}

                                    </div>

                                    {/* AÇÕES */}

                                    <div className={styles.cardActions}>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                editarMusica(musica)
                                            }
                                            className={styles.editButton}
                                            title="Editar música"
                                        >
                                            <FiEdit />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                excluirMusica(
                                                    musica.id
                                                )
                                            }
                                            className={
                                                styles.deleteButton
                                            }
                                            title="Excluir música"
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
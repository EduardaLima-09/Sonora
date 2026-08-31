import { api } from "../api/api";
import { Link } from "react-router-dom";
import Notas from "../componentes/Notas";
import { useState, useEffect } from "react";
import Loading from "../componentes/Loading";
import styles from "./CadastrarMusica.module.css";
import logo from "../assets/LogoSomenteIconeCortada.png";

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
    FiDisc,
    FiTag,
    FiMessageCircle,
    FiUser
} from "react-icons/fi";

function CadastrarMusica() {

    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    const usuario = usuarioSalvo?.usuario || "Visitante";
    const usuarioId = usuarioSalvo?.id;

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

    // Formata a duração que vem do Back-end em segundos
    // para o formato MM:SS.
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

    // Converte a duração digitada no formulário
    // de MM:SS para segundos.
    const converterDuracao = (duracao) => {

        if (!duracao || duracao === "00:00") {
            return 0;
        }

        const partes = duracao.split(":");

        if (partes.length === 2) {

            const minutos = parseInt(partes[0]);
            const segundos = parseInt(partes[1]);

            return minutos * 60 + segundos;
        }

        return 0;
    };

    // Busca todas as músicas do usuário.
    const carregarMusicas = async () => {

        try {

            setCarregandoLista(true);

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

    // Carrega as músicas quando a página é aberta.
    useEffect(() => {

        if (usuarioId) {
            carregarMusicas();
        }

    }, [usuarioId]);

    // Altera os campos do formulário.
    const alterarCampo = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox"
                ? checked
                : value
        });
    };

    // Carrega a imagem escolhida pelo usuário.
    const alterarCapa = (e) => {

        const arquivo = e.target.files[0];

        if (!arquivo) {
            return;
        }

        const leitor = new FileReader();

        leitor.onloadend = () => {

            setFormData({
                ...formData,
                capa: leitor.result
            });
        };

        leitor.readAsDataURL(arquivo);
    };

    // Marca ou desmarca a música como favorita.
    const alternarFavorita = () => {

        setFormData({
            ...formData,
            favorita: !formData.favorita
        });
    };

    // Salva ou atualiza uma música.
    const enviarFormulario = async (e) => {

        e.preventDefault();

        setErro("");
        setSucesso("");

        // Validação dos campos obrigatórios.
        if (
            !formData.nome ||
            !formData.artista ||
            !formData.album
        ) {

            setErro(
                "Preencha nome, artista e álbum."
            );

            return;
        }

        setCarregando(true);

        try {

            const musicaParaEnviar = {

                nome: formData.nome,

                artista: formData.artista,

                album: formData.album,

                duracao: converterDuracao(
                    formData.duracao
                ),

                genero: formData.genero || "",

                favorita: formData.favorita || false,

                capa: formData.capa || "",

                usuarioId: usuarioId
            };

            let musicaSalva;

            // Atualização
            if (editandoId) {

                musicaSalva = await api.putMusica(
                    editandoId,
                    musicaParaEnviar
                );

                setSucesso(
                    "Música atualizada com sucesso!"
                );

            }

            // Cadastro
            else {

                musicaSalva = await api.postMusica(
                    musicaParaEnviar
                );

                setSucesso(
                    "Música cadastrada com sucesso!"
                );
            }

            /*
             * A música já foi salva no Back-end.
             *
             * A anotação é tratada separadamente para que
             * um erro ao salvar a anotação não faça o sistema
             * informar que a música não foi cadastrada.
             */
            if (
                formData.anotacao &&
                musicaSalva?.id
            ) {

                try {

                    await api.postAnotacao({
                        texto: formData.anotacao,
                        musicaId: musicaSalva.id
                    });

                } catch (erroAnotacao) {

                    console.error(
                        "Música salva, mas houve erro ao salvar a anotação:",
                        erroAnotacao
                    );
                }
            }

            /*
             * Busca novamente as músicas depois do cadastro.
             *
             * Isso atualiza a lista imediatamente,
             * sem precisar apertar F5.
             */
            await carregarMusicas();

            // Limpa o formulário.
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

            setEditandoId(null);

            // Limpa a mensagem de sucesso.
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

    // Coloca uma música no formulário para edição.
    const editarMusica = (musica) => {

        setFormData({

            nome: musica.nome,

            artista: musica.artista,

            album: musica.album || "",

            genero: musica.genero || "",

            duracao: formatarDuracao(
                musica.duracao
            ),

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

    // Exclui uma música.
    const excluirMusica = async (id) => {

        if (
            !window.confirm(
                "Tem certeza que deseja excluir esta música?"
            )
        ) {
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

    // Favorita ou desfavorita uma música.
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

    // Cancela o modo de edição.
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

    // Abre ou fecha as anotações de uma música.
    const alternarNotas = (musicaId) => {

        setNotasAbertas((anterior) => ({

            ...anterior,

            [musicaId]: !anterior[musicaId]

        }));
    };

    // Enquanto as músicas estão sendo carregadas.
    if (carregandoLista) {

        return (
            <Loading mensagem="Carregando suas músicas..." />
        );
    }

    return (

        <div className={styles.cadastrar}>

            <aside className={styles.sidebar}>

                <div className={styles.logoContainer}>

                    <img
                        src={logo}
                        alt="Logo-Sonora"
                        className={styles.logo}
                    />

                </div>

                <nav className={styles.nav}>

                    <Link to="/home" className={styles.navItem}>
                        <FiHome className={styles.navIcon} />
                        <span>Início</span>
                    </Link>

                    <Link to="/cadastrarMusica" className={`${styles.navItem} ${styles.active}`}>
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
                        <span className={styles.span}>
                            Sair
                        </span>
                    </Link>

                </div>

            </aside>

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

                {erro && (

                    <div
                        className={styles.modalOverlay}
                        onClick={() => setErro("")}
                    >

                        <div
                            className={`${styles.modal} ${styles.modalError}`}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <button
                                className={styles.modalClose}
                                onClick={() => setErro("")}
                            >
                                ✕
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

                {sucesso && (

                    <div
                        className={styles.modalOverlay}
                        onClick={() => setSucesso("")}
                    >

                        <div
                            className={`${styles.modal} ${styles.modalSuccess}`}
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <button
                                className={styles.modalClose}
                                onClick={() =>
                                    setSucesso("")
                                }
                            >
                                ✕
                            </button>

                            <h3 className={styles.modalTitle}>
                                Sucesso!
                            </h3>

                            <p className={styles.modalMessage}>
                                {sucesso}
                            </p>

                            <button
                                className={styles.modalButtonSuccess}
                                onClick={() =>
                                    setSucesso("")
                                }
                            >
                                Ok
                            </button>

                        </div>

                    </div>
                )}

                <form
                    onSubmit={enviarFormulario}
                    className={styles.form}
                >

                    <div className={styles.formGrid}>

                        <div className={styles.formLeft}>

                            <div className={styles.field}>

                                <label htmlFor="nome">

                                    <FiMusic
                                        className={styles.fieldIcon}
                                    />

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

                                    <FiUser
                                        className={styles.fieldIcon}
                                    />

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

                                    <FiDisc
                                        className={styles.fieldIcon}
                                    />

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

                                        <FiTag
                                            className={styles.fieldIcon}
                                        />

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

                                        <FiClock
                                            className={styles.fieldIcon}
                                        />

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

                            <div className={styles.fieldFavorita}>

                                <label
                                    className={
                                        styles.favoritaLabel
                                    }
                                >

                                    <span>

                                        <FiHeart
                                            className={
                                                styles.fieldIcon
                                            }
                                        />

                                        Marcar como favorita

                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            alternarFavorita
                                        }
                                        className={
                                            styles.coracaoButton
                                        }
                                    >

                                        <FiHeart
                                            className={
                                                formData.favorita
                                                    ? styles.favoritoAtivo
                                                    : styles.favoritoInativo
                                            }
                                            size={28}
                                        />

                                    </button>

                                </label>

                            </div>

                            <div className={styles.field}>

                                <label htmlFor="anotacao">

                                    <FiMessageCircle
                                        className={
                                            styles.fieldIcon
                                        }
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

                        <div className={styles.formRight}>

                            <div
                                className={
                                    styles.capaContainer
                                }
                            >

                                <label
                                    htmlFor="capa"
                                    className={
                                        styles.capaLabel
                                    }
                                >

                                    {formData.capa ? (

                                        <img
                                            src={formData.capa}
                                            alt="Capa"
                                            className={
                                                styles.capaPreview
                                            }
                                        />

                                    ) : (

                                        <>

                                            <FiUpload
                                                className={
                                                    styles.capaIcon
                                                }
                                            />

                                            <span>
                                                Adicionar imagem
                                            </span>

                                            <span
                                                className={
                                                    styles.capaSubtext
                                                }
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
                                    className={
                                        styles.capaInput
                                    }
                                />

                            </div>

                        </div>

                    </div>

                    <div className={styles.formActions}>

                        {editandoId && (

                            <button
                                type="button"
                                onClick={cancelarEdicao}
                                className={
                                    styles.cancelButton
                                }
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

                <section className={styles.listaSection}>

                    <div className={styles.listaHeader}>

                        <h2>
                            Músicas Cadastradas
                        </h2>

                        <span
                            className={
                                styles.totalMusicas
                            }
                        >
                            {musicas.length} músicas
                        </span>

                    </div>

                    <div className={styles.listaMusicas}>

                        {musicas.length === 0 ? (

                            <div
                                className={
                                    styles.emptyStateCadastro
                                }
                            >

                                <p
                                    className={
                                        styles.emptyStateMessage
                                    }
                                >
                                    Você ainda não cadastrou
                                    nenhuma música.
                                </p>

                                <p
                                    className={
                                        styles.emptyStateSubMessage
                                    }
                                >
                                    Preencha o formulário acima
                                    e comece a construir sua
                                    coleção musical!
                                </p>

                            </div>

                        ) : (

                            musicas.map((musica) => (

                                <div
                                    key={musica.id}
                                    className={
                                        styles.cardMusica
                                    }
                                >

                                    <div
                                        className={
                                            styles.cardCapa
                                        }
                                    >

                                        {musica.capa ? (

                                            <img
                                                src={musica.capa}
                                                alt={musica.nome}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />

                                        ) : (

                                            <FiMusic
                                                className={
                                                    styles.cardCapaIcon
                                                }
                                            />

                                        )}

                                    </div>

                                    <div
                                        className={
                                            styles.cardInfo
                                        }
                                    >

                                        <div
                                            className={
                                                styles.cardHeader
                                            }
                                        >

                                            <div
                                                className={
                                                    styles.cardTitulo
                                                }
                                            >

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
                                                        className={
                                                            musica.favorita
                                                                ? styles.favoritoAtivo
                                                                : styles.favoritoInativo
                                                        }
                                                        size={20}
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

                                        <div
                                            className={
                                                styles.cardDetalhes
                                            }
                                        >

                                            {musica.album && (

                                                <span
                                                    className={
                                                        styles.cardAlbum
                                                    }
                                                >

                                                    <FiDisc />

                                                    {musica.album}

                                                </span>

                                            )}

                                            {musica.genero && (

                                                <span
                                                    className={
                                                        styles.cardGenero
                                                    }
                                                >

                                                    <FiTag />

                                                    {musica.genero}

                                                </span>

                                            )}

                                            {musica.duracao > 0 && (

                                                <span
                                                    className={
                                                        styles.cardDuracao
                                                    }
                                                >

                                                    <FiClock />

                                                    {formatarDuracao(
                                                        musica.duracao
                                                    )}

                                                </span>

                                            )}

                                        </div>

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
                                                anotações

                                            </button>

                                        </div>

                                        {notasAbertas[
                                            musica.id
                                        ] && (

                                            <Notas
                                                musicas={musicas}
                                                setMusicas={
                                                    setMusicas
                                                }
                                                musicaId={
                                                    musica.id
                                                }
                                                onClose={() =>
                                                    alternarNotas(
                                                        musica.id
                                                    )
                                                }
                                            />

                                        )}

                                    </div>

                                    <div
                                        className={
                                            styles.cardActions
                                        }
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                editarMusica(
                                                    musica
                                                )
                                            }
                                            className={
                                                styles.editButton
                                            }
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


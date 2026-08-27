import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./CadastrarMusica.module.css";
import Notas from "../componentes/Notas";
import { api } from "../api/api";
import Loading from "../componentes/Loading";

import logo from "../assets/LogoSomenteIconeCortada.png";

import {
    FiHome, FiPlus, FiLogOut, FiMusic, FiHeart, FiTrash2,
    FiEdit, FiSave, FiX, FiUpload, FiClock, FiUser,
    FiDisc, FiTag, FiMessageCircle, FiFeather
} from "react-icons/fi";

function CadastrarMusica() {
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));
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

    const generos = ["MPB", "Rock", "Samba", "Pagode", "Funk", "Soul", "Jazz", "Blues", "Eletrônica", "Indie", "Alternativo", "Outro"];

    const formatarDuracao = (segundos) => {
        if (!segundos || segundos <= 0) return "00:00";
        const min = Math.floor(segundos / 60);
        const sec = segundos % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const converterDuracao = (duracaoStr) => {
        if (!duracaoStr || duracaoStr === "00:00") return 0;
        const partes = duracaoStr.split(':');
        if (partes.length === 2) {
            return parseInt(partes[0]) * 60 + parseInt(partes[1]);
        }
        return 0;
    };

    const carregarMusicas = async () => {
        try {
            setCarregandoLista(true);
            const data = await api.getMusicas(usuarioId);
            
            const musicasComNotas = await Promise.all(
                data.map(async (musica) => {
                    try {
                        const anotacoes = await api.getAnotacoes(musica.id);
                        return { ...musica, notas: anotacoes };
                    } catch {
                        return { ...musica, notas: [] };
                    }
                })
            );
            
            setMusicas(musicasComNotas);
        } catch (error) {
            console.error("Erro ao carregar músicas:", error);
            // Não seta erro aqui para não atrapalhar
        } finally {
            setCarregandoLista(false);
        }
    };

    useEffect(() => {
        if (usuarioId) {
            carregarMusicas();
        }
    }, [usuarioId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
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

    const toggleFavorita = () => {
        setFormData({ ...formData, favorita: !formData.favorita });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setSucesso("");

        if (!formData.nome || !formData.artista || !formData.album) {
            setErro("Preencha nome, artista e álbum.");
            return;
        }

        setCarregando(true);

        try {
            const musicaParaEnviar = {
                nome: formData.nome,
                artista: formData.artista,
                album: formData.album,
                duracao: converterDuracao(formData.duracao),
                genero: formData.genero || "",
                favorita: formData.favorita || false,
                capa: formData.capa || "",
                usuarioId: usuarioId
            };

            let musicaSalva;

            if (editandoId) {
                musicaSalva = await api.putMusica(editandoId, musicaParaEnviar);
                setSucesso("Música atualizada com sucesso!");
            } else {
                musicaSalva = await api.postMusica(musicaParaEnviar);
                setSucesso("Música cadastrada com sucesso!");
            }

            // Se tiver anotação, salvar
            if (formData.anotacao) {
                await api.postAnotacao({
                    texto: formData.anotacao,
                    musicaId: musicaSalva.id
                });
            }

            // 👈 RECARREGAR A LISTA
            await carregarMusicas();

            // 👈 LIMPAR FORMULÁRIO
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

            // 👈 LIMPAR MENSAGENS DEPOIS DE 3 SEGUNDOS
            setTimeout(() => {
                setSucesso("");
            }, 3000);

        } catch (error) {
            console.error("Erro ao salvar música:", error);
            setErro("Erro ao salvar música.");
            
            // 👈 LIMPAR ERRO DEPOIS DE 3 SEGUNDOS
            setTimeout(() => {
                setErro("");
            }, 3000);
        } finally {
            setCarregando(false);
        }
    };

    const handleEdit = (musica) => {
        setFormData({
            nome: musica.nome,
            artista: musica.artista,
            album: musica.album || "",
            genero: musica.genero || "",
            duracao: formatarDuracao(musica.duracao),
            capa: musica.capa || null,
            favorita: musica.favorita || false,
            anotacao: ""
        });
        setEditandoId(musica.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Tem certeza que deseja excluir esta música?")) return;
        try {
            await api.deleteMusica(id, usuarioId);
            await carregarMusicas();
            setSucesso("Música excluída com sucesso!");
            setTimeout(() => setSucesso(""), 3000);
        } catch (error) {
            setErro(error.message || "Erro ao excluir música.");
            setTimeout(() => setErro(""), 3000);
        }
    };

    const handleFavoritar = async (id) => {
        try {
            await api.patchFavoritar(id, usuarioId);
            await carregarMusicas();
        } catch (error) {
            setErro(error.message || "Erro ao favoritar música.");
            setTimeout(() => setErro(""), 3000);
        }
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
            favorita: false,
            anotacao: ""
        });
        setErro("");
    };

    const toggleNotas = (musicaId) => {
        setNotasAbertas((prev) => ({
            ...prev,
            [musicaId]: !prev[musicaId]
        }));
    };

    if (carregandoLista) {
        return <Loading mensagem="Carregando suas músicas..." />;
    }

    return (
        <div className={styles.cadastrar}>
            <aside className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="Logo-Sonora" className={styles.logo} />
                </div>

                <nav className={styles.nav}>
                    <Link to="/home" className={styles.navItem}>
                        <FiHome className={styles.navIcon} />
                        <span>Início</span>
                    </Link>
                    <Link to="/cadastrarMusica" className={`${styles.navItem} ${styles.active}`}>
                        <FiPlus className={styles.navIcon} />
                        <span>Cadastrar Música</span>
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userInfo}>
                        <div className={styles.userAvatar}>
                            {usuario.charAt(0).toUpperCase()}
                        </div>
                        <span className={styles.userName}>{usuario}</span>
                    </div>
                    <Link to="/" className={styles.logoutButton}>
                        <FiLogOut className={styles.navIcon} />
                        <span>Sair</span>
                    </Link>
                </div>
            </aside>

            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>
                            {editandoId ? "Editando Música" : "Cadastrar nova música"}
                        </h1>
                        <p className={styles.subtitle}>
                            Adicione uma música à sua coleção e mantenha suas memórias musicais organizadas.
                        </p>
                    </div>
                </header>

                {/* 👈 MOSTRAR MENSAGENS */}
                {erro && <div className={styles.errorMessage}>{erro}</div>}
                {sucesso && <div className={styles.successMessage}>{sucesso}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
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
                                        <option value="">Selecione</option>
                                        {generos.map((g) => (
                                            <option key={g} value={g}>{g}</option>
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

                            <div className={styles.field}>
                                <label className={styles.favoritaLabel}>
                                    <span>Marcar como favorita</span>
                                    <button
                                        type="button"
                                        onClick={toggleFavorita}
                                        className={styles.coracaoButton}
                                    >
                                        <FiHeart 
                                            className={formData.favorita ? styles.favoritoAtivo : styles.favoritoInativo}
                                            size={28}
                                        />
                                    </button>
                                </label>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="anotacao">Anotações sobre a música</label>
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
                        {editandoId && (
                            <button type="button" onClick={cancelarEdicao} className={styles.cancelButton}>
                                <FiX /> Cancelar
                            </button>
                        )}
                        <button type="submit" className={styles.saveButton} disabled={carregando}>
                            <FiSave />
                            {carregando ? "Salvando..." : (editandoId ? "Atualizar" : "Salvar")}
                        </button>
                    </div>
                </form>

                <section className={styles.listaSection}>
                    <div className={styles.listaHeader}>
                        <h2>Músicas Cadastradas</h2>
                        <span className={styles.totalMusicas}>{musicas.length} músicas</span>
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
                                            <img 
                                                src={musica.capa} 
                                                alt={musica.nome} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
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
                                                    title={musica.favorita ? "Desfavoritar" : "Favoritar"}
                                                >
                                                    <FiHeart
                                                        className={musica.favorita ? styles.favoritoAtivo : styles.favoritoInativo}
                                                        size={20}
                                                    />
                                                </button>
                                            </div>
                                            <span className={styles.cardArtista}>{musica.artista}</span>
                                        </div>

                                        <div className={styles.cardDetalhes}>
                                            {musica.album && (
                                                <span className={styles.cardAlbum}>
                                                    <FiDisc /> {musica.album}
                                                </span>
                                            )}
                                            {musica.genero && (
                                                <span className={styles.cardGenero}>
                                                    <FiTag /> {musica.genero}
                                                </span>
                                            )}
                                            {musica.duracao > 0 && (
                                                <span className={styles.cardDuracao}>
                                                    <FiClock /> {formatarDuracao(musica.duracao)}
                                                </span>
                                            )}
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <button
                                                onClick={() => toggleNotas(musica.id)}
                                                className={styles.notasButton}
                                            >
                                                <FiMessageCircle />
                                                {musica.notas?.length || 0} anotações
                                            </button>
                                        </div>

                                        {notasAbertas[musica.id] && (
                                            <Notas
                                                musicas={musicas}
                                                setMusicas={setMusicas}
                                                musicaId={musica.id}
                                                onClose={() => toggleNotas(musica.id)}
                                            />
                                        )}
                                    </div>

                                    <div className={styles.cardActions}>
                                        <button onClick={() => handleEdit(musica)} className={styles.editButton}>
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
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { api } from "../api/api";
import Loading from "../componentes/Loading";

import {
    FiHome, FiMusic, FiHeart, FiUser, FiSearch,
    FiPlus, FiLogOut, FiHeadphones, FiStar, FiMessageCircle
} from "react-icons/fi";

import logo from "../assets/LogoSomenteIconeCortada.png";

const coresCapas = [
    "#6C3D5F", "#A63088", "#D79FC4", "#40265C",
    "#AE5CA6", "#BB6AB0", "#8B4A82", "#5A2D50",
    "#7A3D6A", "#C48AB8", "#9A5A8A", "#E8B8D8"
];

function Home() {
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));
    const usuario = usuarioSalvo?.usuario || "Visitante";
    const usuarioId = usuarioSalvo?.id;

    const [musicasRecentes, setMusicasRecentes] = useState([]);
    const [favoritas, setFavoritas] = useState([]);
    const [stats, setStats] = useState({ musicas: 0, artistas: 0, favoritas: 0 });
    const [artistaDestaque, setArtistaDestaque] = useState({ nome: "", musicas: 0 });
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");
    const [modalNotas, setModalNotas] = useState({ musicaId: null, notas: [] });

    // 👈 CARREGAR ANOTAÇÕES QUANDO ABRIR MODAL
    const carregarAnotacoes = async (musicaId) => {
        try {
            const anotacoes = await api.getAnotacoes(musicaId);
            setModalNotas({ musicaId, notas: anotacoes });
        } catch (error) {
            console.error("Erro ao carregar anotações:", error);
            setModalNotas({ musicaId, notas: [] });
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            setCarregando(true);
            try {
                const musicas = await api.getMusicas(usuarioId);
                
                // Carregar anotações para cada música
                const musicasComNotas = await Promise.all(
                    musicas.map(async (musica) => {
                        try {
                            const anotacoes = await api.getAnotacoes(musica.id);
                            return { ...musica, notas: anotacoes };
                        } catch {
                            return { ...musica, notas: [] };
                        }
                    })
                );
                
                setMusicasRecentes(musicasComNotas.slice(0, 8));
                
                const favoritasList = musicasComNotas.filter(m => m.favorita);
                setFavoritas(favoritasList);
                
                const artistasUnicos = new Set(musicasComNotas.map(m => m.artista));
                setStats({
                    musicas: musicasComNotas.length,
                    artistas: artistasUnicos.size,
                    favoritas: favoritasList.length
                });

                if (musicasComNotas.length > 0) {
                    const contagemArtistas = {};
                    musicasComNotas.forEach(m => {
                        contagemArtistas[m.artista] = (contagemArtistas[m.artista] || 0) + 1;
                    });
                    
                    let artistaTop = "";
                    let maxMusicas = 0;
                    for (const [artista, count] of Object.entries(contagemArtistas)) {
                        if (count > maxMusicas) {
                            maxMusicas = count;
                            artistaTop = artista;
                        }
                    }
                    
                    setArtistaDestaque({
                        nome: artistaTop,
                        musicas: maxMusicas
                    });
                }
                
            } catch (error) {
                setErro("Erro ao carregar músicas.");
            } finally {
                setCarregando(false);
            }
        };
        carregarDados();
    }, [usuarioId]);

    if (carregando) return <Loading />;
    if (erro) return <div className={styles.errorContainer}>{erro}</div>;

    const abrirModalNotas = (musica) => {
        carregarAnotacoes(musica.id);
    };

    const fecharModalNotas = () => {
        setModalNotas({ musicaId: null, notas: [] });
    };

    return (
        <div className={styles.home}>
            <aside className={styles.sidebar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="Sonora" className={styles.logo} />
                </div>

                <nav className={styles.nav}>
                    <Link to="/home" className={`${styles.navItem} ${styles.active}`}>
                        <FiHome className={styles.navIcon} />
                        <span>Início</span>
                    </Link>
                    <Link to="/cadastrarMusica" className={styles.navItem}>
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
                        <h1 className={styles.title}>Olá, {usuario}!</h1>
                        <p className={styles.subtitle}>Que música combina com o seu momento hoje?</p>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.search}>
                            <input type="text" placeholder="Buscar músicas..." />
                            <FiSearch className={styles.searchIcon} />
                        </div>
                    </div>
                </header>

                <section className={styles.stats}>
                    <div className={styles.statCard}>
                        <div className={styles.statIconWrapper}>
                            <FiMusic className={styles.statIcon} />
                        </div>
                        <div>
                            <span className={styles.statLabel}>Músicas cadastradas</span>
                            <span className={styles.statNumber}>{stats.musicas}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIconWrapper}>
                            <FiUser className={styles.statIcon} />
                        </div>
                        <div>
                            <span className={styles.statLabel}>Artistas Cadastrados</span>
                            <span className={styles.statNumber}>{stats.artistas}</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIconWrapper}>
                            <FiHeart className={styles.statIcon} />
                        </div>
                        <div>
                            <span className={styles.statLabel}>Favoritas</span>
                            <span className={styles.statNumber}>{stats.favoritas}</span>
                        </div>
                    </div>
                </section>

                <section className={styles.destaque}>
                    <div className={styles.destaqueCard}>
                        <div className={styles.destaqueTop}>
                            <div className={styles.destaqueLeft}>
                                <span className={styles.destaqueLabel}>Artista em destaque</span>
                                <h3 className={styles.destaqueNome}>
                                    {artistaDestaque.nome || "Nenhum artista cadastrado"}
                                </h3>
                                <div className={styles.destaqueStats}>
                                    <span>
                                        <FiMusic className={styles.destaqueStatIcon} />
                                        {artistaDestaque.musicas} músicas cadastradas
                                    </span>
                                </div>
                            </div>
                            <div className={styles.destaqueImagem}>
                                <FiHeadphones className={styles.destaqueImagemIcon} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.secao}>
                    <div className={styles.secaoHeader}>
                        <h2>Cadastradas Recentemente</h2>
                        <p className={styles.secaoSubtitulo}>Músicas que você ouviu recentemente e cadastrou</p>
                    </div>

                    <div className={styles.listaMusicas}>
                        {musicasRecentes.length === 0 ? (
                            <p className={styles.emptyMessage}>
                                Nenhuma música cadastrada ainda. 
                                <Link to="/cadastrarMusica"> Cadastre sua primeira música!</Link>
                            </p>
                        ) : (
                            musicasRecentes.map((musica, index) => (
                                <div key={musica.id} className={styles.cardMusica}>
                                    <div 
                                        className={styles.cardCapa} 
                                        style={{ backgroundColor: coresCapas[index % coresCapas.length] }}
                                    >
                                        {musica.capa ? (
                                            <img 
                                                src={musica.capa} 
                                                alt={musica.nome} 
                                                className={styles.cardCapaImagem}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <FiMusic className={styles.cardCapaIcon} />
                                        )}
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <span className={styles.cardNome}>{musica.nome}</span>
                                        <span className={styles.cardArtista}>{musica.artista}</span>
                                    </div>
                                    {musica.notas && musica.notas.length > 0 && (
                                        <button
                                            onClick={() => abrirModalNotas(musica)}
                                            className={styles.notasButton}
                                        >
                                            <FiMessageCircle />
                                            {musica.notas.length}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className={styles.secao}>
                    <div className={styles.secaoHeader}>
                        <h2>
                            Suas favoritas
                            <FiHeart className={styles.secaoIconFavoritas} />
                        </h2>
                        <p className={styles.secaoSubtituloFavoritas}>As músicas que você marcou como favoritas.</p>
                    </div>

                    <div className={styles.listaFavoritas}>
                        {favoritas.length === 0 ? (
                            <p className={styles.emptyMessage}>
                                Nenhuma música favorita ainda. 
                                Marque uma como favorita!
                            </p>
                        ) : (
                            favoritas.map((musica, index) => (
                                <div key={musica.id} className={styles.cardFavorita}>
                                    <div 
                                        className={styles.cardCapa} 
                                        style={{ backgroundColor: coresCapas[(index + 4) % coresCapas.length] }}
                                    >
                                        {musica.capa ? (
                                            <img 
                                                src={musica.capa} 
                                                alt={musica.nome} 
                                                className={styles.cardCapaImagem}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <FiHeart className={styles.cardCapaIcon} />
                                        )}
                                    </div>
                                    <div className={styles.cardInfo}>
                                        <span className={styles.favoritaNome}>{musica.nome}</span>
                                        <span className={styles.favoritaArtista}>{musica.artista}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {modalNotas.musicaId && (
                <div className={styles.modalOverlay} onClick={fecharModalNotas}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>
                                <FiMessageCircle className={styles.modalIcon} />
                                Anotações
                            </h3>
                            <button onClick={fecharModalNotas} className={styles.modalClose}>
                                ✕
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {modalNotas.notas.length === 0 ? (
                                <p className={styles.modalVazio}>Nenhuma anotação para esta música.</p>
                            ) : (
                                modalNotas.notas.map((nota) => (
                                    <div key={nota.id} className={styles.modalNota}>
                                        <p className={styles.modalTexto}>{nota.texto}</p>
                                        <span className={styles.modalData}>
                                            {new Date(nota.criadoEm).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
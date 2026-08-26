import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

import {
    FiHome,
    FiMusic,
    FiHeart,
    FiUser,
    FiSearch,
    FiPlus,
    FiLogOut,
    FiHeadphones,
    FiStar,
    FiMessageCircle
} from "react-icons/fi";

import logo from "../assets/LogoSomenteIconeCortada.png";

// Cores para as capas das músicas
const coresCapas = [
    "#6C3D5F", "#A63088", "#D79FC4", "#40265C",
    "#AE5CA6", "#BB6AB0", "#8B4A82", "#5A2D50",
    "#7A3D6A", "#C48AB8", "#9A5A8A", "#E8B8D8"
];

function Home() {
    const usuario = "du4ards_";

    // ============================
    // MÚSICAS RECENTES
    // ============================
    const [musicasRecentes, setMusicasRecentes] = useState([
        {
            id: 1,
            nome: "United in Grief",
            artista: "Kendrick Lamar",
            notas: [{ id: 1, texto: "Essa música me faz refletir sobre a vida...", criadoEm: "2024-01-15T10:30:00" }]
        },
        {
            id: 2,
            nome: "Flashing Lights",
            artista: "Kanye West",
            notas: []
        },
        {
            id: 3,
            nome: "Syss Without A Face",
            artista: "Unknown",
            notas: []
        },
        {
            id: 4,
            nome: "GONE, GONE, I THANK YOU",
            artista: "Tyler, The Creator",
            notas: []
        },
        {
            id: 5,
            nome: "What You Need",
            artista: "The Weeknd",
            notas: []
        },
        {
            id: 6,
            nome: "PRIDE.",
            artista: "Kendrick Lamar",
            notas: [{ id: 2, texto: "Minha música favorita do Kendrick!", criadoEm: "2024-01-16T14:20:00" }]
        },
        {
            id: 7,
            nome: "Duvet",
            artista: "bôa",
            notas: []
        },
        {
            id: 8,
            nome: "Moonlight",
            artista: "Kali Uchis",
            notas: []
        }
    ]);

    // ============================
    // FAVORITAS
    // ============================
    const [favoritas, setFavoritas] = useState([
        {
            id: 101,
            nome: "Cigana",
            artista: "Jorge Ben Jor",
            notas: [{ id: 1011, texto: "Essa música me lembra do verão de 2019...", criadoEm: "2024-01-15T10:30:00" }]
        },
        {
            id: 102,
            nome: "Palco",
            artista: "Gilberto Gil",
            notas: []
        },
        {
            id: 103,
            nome: "Domingaz",
            artista: "Jorge Ben Jor",
            notas: []
        },
        {
            id: 104,
            nome: "Te Gosto",
            artista: "Jorge Ben Jor",
            notas: []
        },
        {
            id: 105,
            nome: "Quais mais vocês gostam de listening?",
            artista: "Jorge Ben Jor",
            notas: []
        },
        {
            id: 106,
            nome: "Figa De Guiné",
            artista: "Jorge Ben Jor",
            notas: []
        },
        {
            id: 107,
            nome: "Alívio",
            artista: "Jorge Ben Jor",
            notas: []
        },
        {
            id: 108,
            nome: "Me Chamando de Paixão",
            artista: "Jorge Ben Jor",
            notas: []
        }
    ]);

    // ============================
    // ESTADOS
    // ============================
    const [artistaDestaque, setArtistaDestaque] = useState({
        nome: "Jorge Ben Jor",
        musicas: 12,
        albuns: 4
    });

    const [modalNotas, setModalNotas] = useState({ musicaId: null, notas: [] });

    const stats = {
        musicas: 30,
        artistas: 18,
        favoritas: 8
    };

    // ============================
    // FUNÇÕES
    // ============================
    const abrirModalNotas = (musica) => {
        setModalNotas({ musicaId: musica.id, notas: musica.notas || [] });
    };

    const fecharModalNotas = () => {
        setModalNotas({ musicaId: null, notas: [] });
    };

    // ============================
    // RENDER
    // ============================
    return (
        <div className={styles.home}>
            {/* SIDEBAR */}
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
                        <div className={styles.userAvatar}>{usuario.charAt(0).toUpperCase()}</div>
                        <span className={styles.userName}>{usuario}</span>
                    </div>
                    <Link to="/" className={styles.logoutButton}>
                        <FiLogOut className={styles.navIcon} />
                        <span>Sair</span>
                    </Link>
                </div>
            </aside>

            {/* CONTEÚDO */}
            <main className={styles.main}>
                {/* HEADER */}
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

                {/* STATS */}
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

                {/* ARTISTA EM DESTAQUE */}
                <section className={styles.destaque}>
                    <div className={styles.destaqueCard}>
                        <div className={styles.destaqueTop}>
                            <div className={styles.destaqueLeft}>
                                <span className={styles.destaqueLabel}>Artista em destaque</span>
                                <h3 className={styles.destaqueNome}>{artistaDestaque.nome}</h3>
                                <div className={styles.destaqueStats}>
                                    <span>
                                        <FiMusic className={styles.destaqueStatIcon} />
                                        {artistaDestaque.musicas} músicas cadastradas
                                    </span>
                                    <span>
                                        <FiStar className={styles.destaqueStatIcon} />
                                        {artistaDestaque.albuns} álbuns
                                    </span>
                                </div>
                            </div>
                            <div className={styles.destaqueImagem}>
                                <FiHeadphones className={styles.destaqueImagemIcon} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* MÚSICAS RECENTES */}
                <section className={styles.secao}>
                    <div className={styles.secaoHeader}>
                        <h2>Cadastradas Recentemente</h2>
                        <p className={styles.secaoSubtitulo}>Músicas que você ouviu recentemente e cadastrou</p>
                    </div>

                    <div className={styles.listaMusicas}>
                        {musicasRecentes.map((musica, index) => (
                            <div key={musica.id} className={styles.cardMusica}>
                                <div 
                                    className={styles.cardCapa} 
                                    style={{ backgroundColor: coresCapas[index % coresCapas.length] }}
                                >
                                    <FiMusic className={styles.cardCapaIcon} />
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
                        ))}
                    </div>
                </section>

                {/* FAVORITAS */}
                <section className={styles.secao}>
                    <div className={styles.secaoHeader}>
                        <h2>
                            Suas favoritas
                            <FiHeart className={styles.secaoIconFavoritas} />
                        </h2>
                        <p className={styles.secaoSubtituloFavoritas}>As músicas que você marcou como favoritas.</p>
                    </div>

                    <div className={styles.listaFavoritas}>
                        {favoritas.map((musica, index) => (
                            <div key={musica.id} className={styles.cardFavorita}>
                                <div 
                                    className={styles.cardCapa} 
                                    style={{ backgroundColor: coresCapas[(index + 4) % coresCapas.length] }}
                                >
                                    <FiHeart className={styles.cardCapaIcon} />
                                </div>
                                <div className={styles.cardInfo}>
                                    <span className={styles.favoritaNome}>{musica.nome}</span>
                                    <span className={styles.favoritaArtista}>{musica.artista}</span>
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
                        ))}
                    </div>
                </section>
            </main>

            {/* ===== MODAL NOTAS ===== */}
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
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

// Importando ícones do react-icons
import {
    FiHome,
    FiMusic,
    FiHeart,
    FiUser,
    FiSearch,
    FiPlus,
    FiLogOut,
    FiHeadphones,
    FiMic,
    FiStar,
    FiMessageCircle
} from "react-icons/fi";

import logo from "../assets/LogoSomenteIconeCortada.png";
import Notas from "../componentes/Notas";

function Home() {
    // Estado com músicas recentes + anotações
    const [musicasRecentes, setMusicasRecentes] = useState([
        { 
            id: 1,
            nome: "United in Grief", 
            artista: "Kendrick Lamar",
            notas: [
                { id: 1, texto: "Essa música me faz refletir sobre a vida...", criadoEm: "2024-01-15T10:30:00" }
            ]
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
            notas: [
                { id: 2, texto: "Minha música favorita do Kendrick!", criadoEm: "2024-01-16T14:20:00" }
            ]
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

    const [favoritas, setFavoritas] = useState([
        { 
            id: 101, 
            nome: "Cigana", 
            artista: "Jorge Ben Jor",
            notas: [
                { id: 1011, texto: "Essa música me lembra do verão de 2019...", criadoEm: "2024-01-15T10:30:00" }
            ]
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

    const [artistaDestaque, setArtistaDestaque] = useState({
        nome: "Jorge Ben Jor",
        musicas: 12,
        albuns: 4
    });

    const [notasAbertas, setNotasAbertas] = useState({});

    const stats = {
        musicas: 30,
        artistas: 18,
        favoritas: 8
    };

    const usuario = "du4ards_";

    const toggleNotas = (musicaId) => {
        setNotasAbertas(prev => ({
            ...prev,
            [musicaId]: !prev[musicaId]
        }));
    };

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

            {/* CONTEÚDO PRINCIPAL */}
            <main className={styles.main}>
                {/* HEADER */}
                <header className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>
                            Olá, {usuario}!
                        </h1>
                        <p className={styles.subtitle}>
                            Que música combina com o seu momento hoje?
                        </p>
                    </div>
                    <div className={styles.headerRight}>
                        <div className={styles.search}>
                            <input type="text" placeholder="Buscar músicas..." />
                            <FiSearch className={styles.searchIcon} />
                        </div>
                    </div>
                </header>

                {/* ESTATÍSTICAS */}
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
                        <div className={styles.destaqueInfo}>
                            <span className={styles.destaqueLabel}>
                                Artista em destaque
                            </span>
                            <h3 className={styles.destaqueNome}>{artistaDestaque.nome}</h3>
                            <div className={styles.destaqueStats}>
                                <span>
                                    <FiMusic className={styles.destaqueStatIcon} />
                                    {artistaDestaque.musicas} músicas cadastradas
                                </span>
                                <span className={styles.destaqueDivisor}>•</span>
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
                                <span className={styles.cardNumero}>{String(index + 1).padStart(2, '0')}</span>
                                <FiMusic className={styles.cardMusicaIcon} />
                                <div className={styles.cardInfo}>
                                    <span className={styles.cardNome}>{musica.nome}</span>
                                    <span className={styles.cardArtista}>{musica.artista}</span>
                                    {/* BOTÃO ANOTAÇÕES */}
                                    <button
                                        onClick={() => toggleNotas(musica.id)}
                                        className={styles.notasButton}
                                    >
                                        <FiMessageCircle />
                                        {musica.notas?.length || 0}
                                    </button>
                                    {/* ANOTAÇÕES */}
                                    {notasAbertas[musica.id] && (
                                        <Notas
                                            musicas={musicasRecentes}
                                            setMusicas={setMusicasRecentes}
                                            musicaId={musica.id}
                                            onClose={() => toggleNotas(musica.id)}
                                        />
                                    )}
                                </div>
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
                        {favoritas.map((musica) => (
                            <div key={musica.id} className={styles.cardFavorita}>
                                <FiHeart className={styles.favoritaIcon} />
                                <div className={styles.cardInfo}>
                                    <span className={styles.favoritaNome}>{musica.nome}</span>
                                    <span className={styles.favoritaArtista}>{musica.artista}</span>
                                    {/* BOTÃO ANOTAÇÕES NAS FAVORITAS */}
                                    <button
                                        onClick={() => toggleNotas(musica.id)}
                                        className={styles.notasButton}
                                    >
                                        <FiMessageCircle />
                                        {musica.notas?.length || 0}
                                    </button>
                                    {/* ANOTAÇÕES NAS FAVORITAS */}
                                    {notasAbertas[musica.id] && (
                                        <Notas
                                            musicas={favoritas}
                                            setMusicas={setFavoritas}
                                            musicaId={musica.id}
                                            onClose={() => toggleNotas(musica.id)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
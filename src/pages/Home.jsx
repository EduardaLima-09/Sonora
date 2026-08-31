
import { api } from "../api/api";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "../componentes/Loading";
import logo from "../assets/LogoSomenteIconeCortada.png";

import {
    FiHome,
    FiMusic,
    FiHeart,
    FiUser,
    FiSearch,
    FiPlus,
    FiLogOut,
    FiHeadphones,
    FiMessageCircle
} from "react-icons/fi";

// Cores utilizadas quando a música não possui capa.
const coresCapas = [
    "#6C3D5F",
    "#A63088",
    "#D79FC4",
    "#40265C",
    "#AE5CA6",
    "#BB6AB0",
    "#8B4A82",
    "#5A2D50",
    "#7A3D6A",
    "#C48AB8",
    "#9A5A8A",
    "#E8B8D8"
];

function Home() {

    const usuarioSalvo = JSON.parse(
        localStorage.getItem("usuario")
    );

    const usuarioId = usuarioSalvo?.id;
    const usuario = usuarioSalvo?.usuario || "Visitante";

    const [erro, setErro] = useState("");

    const [favoritas, setFavoritas] = useState([]);

    const [carregando, setCarregando] = useState(true);

    const [musicasRecentes, setMusicasRecentes] = useState([]);

    const [modalNotas, setModalNotas] = useState({
        musicaId: null,
        notas: []
    });

    const [estatisticas, setEstatisticas] = useState({
        musicas: 0,
        artistas: 0,
        favoritas: 0
    });

    const [artistaDestaque, setArtistaDestaque] = useState({
        nome: "",
        musicas: 0
    });


    /*
     * Busca as anotações de uma música
     * e abre o modal.
     */
    const carregarAnotacoes = async (musicaId) => {

        try {

            const anotacoes = await api.getAnotacoes(
                musicaId
            );

            setModalNotas({
                musicaId: musicaId,
                notas: anotacoes
            });

        } catch (erro) {

            console.error(
                "Erro ao carregar anotações:",
                erro
            );

            setModalNotas({
                musicaId: musicaId,
                notas: []
            });
        }
    };


    /*
     * Busca todas as músicas do usuário
     * e atualiza todas as informações da Home.
     */
    const carregarDados = async () => {

        if (!usuarioId) {
            setCarregando(false);
            return;
        }

        setCarregando(true);
        setErro("");

        try {

            const musicas = await api.getMusicas(
                usuarioId
            );


            /*
             * Busca as anotações de cada música.
             *
             * Se uma anotação der erro, a música continua
             * aparecendo normalmente.
             */
            const musicasComNotas = await Promise.all(

                musicas.map(async (musica) => {

                    try {

                        const anotacoes =
                            await api.getAnotacoes(
                                musica.id
                            );

                        return {
                            ...musica,
                            notas: anotacoes
                        };

                    } catch (erroAnotacao) {

                        console.error(
                            "Erro ao carregar anotação da música:",
                            erroAnotacao
                        );

                        return {
                            ...musica,
                            notas: []
                        };
                    }
                })
            );


            /*
             * Músicas cadastradas recentemente.
             */
            setMusicasRecentes(
                musicasComNotas.slice(0, 8)
            );


            /*
             * Filtra somente as músicas favoritas.
             */
            const listaFavoritas =
                musicasComNotas.filter(
                    (musica) => musica.favorita
                );

            setFavoritas(listaFavoritas);


            /*
             * Conta quantas músicas existem.
             */
            const quantidadeArtistas =
                new Set(
                    musicasComNotas.map(
                        (musica) => musica.artista
                    )
                ).size;


            setEstatisticas({
                musicas: musicasComNotas.length,
                artistas: quantidadeArtistas,
                favoritas: listaFavoritas.length
            });


            /*
             * Descobre qual artista possui
             * mais músicas cadastradas.
             */
            if (musicasComNotas.length > 0) {

                const contagemArtistas = {};

                musicasComNotas.forEach((musica) => {

                    const artista = musica.artista;

                    contagemArtistas[artista] =
                        (contagemArtistas[artista] || 0) + 1;
                });


                let artistaMaisCadastrado = "";
                let maiorQuantidade = 0;


                for (
                    const [artista, quantidade]
                    of Object.entries(contagemArtistas)
                ) {

                    if (
                        quantidade > maiorQuantidade
                    ) {

                        maiorQuantidade = quantidade;
                        artistaMaisCadastrado = artista;
                    }
                }


                setArtistaDestaque({
                    nome: artistaMaisCadastrado,
                    musicas: maiorQuantidade
                });

            } else {

                /*
                 * Caso não existam músicas,
                 * reseta o artista em destaque.
                 */
                setArtistaDestaque({
                    nome: "Nenhum Artista Cadastrado",
                    musicas: 0
                });
            }

        } catch (erro) {

            console.error(
                "Erro ao carregar dados da Home:",
                erro
            );

            setErro(
                "Não foi possível carregar as músicas."
            );

        } finally {

            setCarregando(false);
        }
    };


    /*
     * Carrega os dados quando a Home é aberta.
     */
    useEffect(() => {

        carregarDados();

    }, [usuarioId]);


    /*
     * Atualiza a Home quando o usuário volta
     * para a aba/janela do navegador.
     *
     * Isso ajuda a garantir que uma música cadastrada
     * em outra tela apareça sem precisar apertar F5.
     */
    useEffect(() => {

        const atualizarAoVoltarParaPagina = () => {

            if (
                document.visibilityState === "visible"
            ) {
                carregarDados();
            }
        };


        document.addEventListener(
            "visibilitychange",
            atualizarAoVoltarParaPagina
        );


        return () => {

            document.removeEventListener(
                "visibilitychange",
                atualizarAoVoltarParaPagina
            );
        };

    }, [usuarioId]);


    /*
     * Abre as anotações de uma música.
     */
    const abrirAnotacoes = (musica) => {

        carregarAnotacoes(musica.id);
    };


    /*
     * Fecha o modal de anotações.
     */
    const fecharAnotacoes = () => {

        setModalNotas({
            musicaId: null,
            notas: []
        });
    };


    if (carregando) {

        return <Loading />;
    }


    if (erro) {

        return (
            <div className={styles.errorContainer}>
                {erro}
            </div>
        );
    }


    return (

        <div className={styles.home}>

            <aside className={styles.sidebar}>

                <div className={styles.logoContainer}>

                    <img
                        src={logo}
                        alt="Logo-Sonora"
                        className={styles.logo}
                    />

                </div>


                <nav className={styles.nav}>

                    <Link
                        to="/home"
                        className={`${styles.navItem} ${styles.active}`}
                    >

                        <FiHome
                            className={styles.navIcon}
                        />

                        <span>
                            Início
                        </span>

                    </Link>


                    <Link
                        to="/cadastrarMusica"
                        className={styles.navItem}
                    >

                        <FiPlus
                            className={styles.navIcon}
                        />

                        <span>
                            Música
                        </span>

                    </Link>

                </nav>


                <div className={styles.sidebarFooter}>

                    <div className={styles.userInfo}>

                        <div className={styles.userAvatar}>

                            {usuario
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <span
                            className={
                                styles.userName
                            }
                        >
                            {usuario}
                        </span>

                    </div>


                    <Link
                        to="/"
                        className={styles.logoutButton}
                    >

                        <FiLogOut
                            className={styles.navIcon}
                        />

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

                            Olá,{" "}

                            <span
                                className={
                                    styles.titleSpan
                                }
                            >
                                {usuario}
                            </span>

                            !

                        </h1>


                        <p
                            className={
                                styles.subtitle
                            }
                        >
                            Qual memória você vai guardar
                            em forma de música hoje?
                        </p>

                    </div>


                    <div className={styles.headerRight}>

                        <div className={styles.search}>

                            <input
                                type="text"
                                placeholder="Buscar músicas..."
                            />

                            <FiSearch
                                className={
                                    styles.searchIcon
                                }
                            />

                        </div>

                    </div>

                </header>


                {/* ESTATÍSTICAS */}

                <section className={styles.stats}>

                    <div className={styles.statCard}>

                        <div
                            className={
                                styles.statIconWrapper
                            }
                        >

                            <FiMusic
                                className={
                                    styles.statIcon
                                }
                            />

                        </div>

                        <div>

                            <span
                                className={
                                    styles.statLabel
                                }
                            >
                                Músicas Cadastradas
                            </span>

                            <span
                                className={
                                    styles.statNumber
                                }
                            >
                                {estatisticas.musicas}
                            </span>

                        </div>

                    </div>


                    <div className={styles.statCard}>

                        <div
                            className={
                                styles.statIconWrapper
                            }
                        >

                            <FiUser
                                className={
                                    styles.statIcon
                                }
                            />

                        </div>

                        <div>

                            <span
                                className={
                                    styles.statLabel
                                }
                            >
                                Artistas Cadastrados
                            </span>

                            <span
                                className={
                                    styles.statNumber
                                }
                            >
                                {estatisticas.artistas}
                            </span>

                        </div>

                    </div>


                    <div className={styles.statCard}>

                        <div
                            className={
                                styles.statIconWrapper
                            }
                        >

                            <FiHeart
                                className={
                                    styles.statIcon
                                }
                            />

                        </div>

                        <div>

                            <span
                                className={
                                    styles.statLabel
                                }
                            >
                                Músicas Favoritas
                            </span>

                            <span
                                className={
                                    styles.statNumber
                                }
                            >
                                {estatisticas.favoritas}
                            </span>

                        </div>

                    </div>

                </section>


                {/* ARTISTA EM DESTAQUE */}

                <section className={styles.destaque}>

                    <div
                        className={
                            styles.destaqueCard
                        }
                    >

                        <div
                            className={
                                styles.destaqueTop
                            }
                        >

                            <div
                                className={
                                    styles.destaqueLeft
                                }
                            >

                                <span
                                    className={
                                        styles.destaqueLabel
                                    }
                                >
                                    Artista em destaque
                                </span>


                                <h3
                                    className={
                                        styles.destaqueNome
                                    }
                                >
                                    {artistaDestaque.nome ||
                                        "Nenhum Artista Cadastrado"}
                                </h3>


                                <div
                                    className={
                                        styles.destaqueStats
                                    }
                                >

                                    <span>

                                        <FiMusic
                                            className={
                                                styles.destaqueStatIcon
                                            }
                                        />

                                        {artistaDestaque.musicas}
                                        {" "}
                                        músicas cadastradas

                                    </span>

                                </div>

                            </div>


                            <div
                                className={
                                    styles.destaqueImagem
                                }
                            >

                                <FiHeadphones
                                    className={
                                        styles.destaqueImagemIcon
                                    }
                                />

                            </div>

                        </div>

                    </div>

                </section>


                {/* MÚSICAS RECENTES */}

                <section className={styles.secao}>

                    <div
                        className={
                            styles.secaoHeader
                        }
                    >

                        <h2>
                            Cadastradas Recentemente
                        </h2>

                        <p
                            className={
                                styles.secaoSubtitulo
                            }
                        >
                            Músicas que você cadastrou
                            recentemente
                        </p>

                    </div>


                    <div
                        className={
                            styles.listaMusicas
                        }
                    >

                        {musicasRecentes.length === 0 ? (

                            <div
                                className={
                                    styles.emptyState
                                }
                            >

                                <p
                                    className={
                                        styles.emptyStateMessage
                                    }
                                >
                                    {usuario}, você ainda
                                    não cadastrou nenhuma
                                    música.
                                </p>


                                <Link to="/cadastrarMusica">

                                    <button
                                        className={
                                            styles.emptyStateButton
                                        }
                                    >
                                        Cadastre sua primeira
                                        música!
                                    </button>

                                </Link>

                            </div>

                        ) : (

                            musicasRecentes.map(
                                (musica, indice) => (

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
                                            style={{
                                                backgroundColor:
                                                    coresCapas[
                                                        indice %
                                                        coresCapas.length
                                                    ]
                                            }}
                                        >

                                            {musica.capa ? (

                                                <img
                                                    src={
                                                        musica.capa
                                                    }
                                                    alt={
                                                        musica.nome
                                                    }
                                                    className={
                                                        styles.cardCapaImagem
                                                    }
                                                    style={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            "100%",
                                                        objectFit:
                                                            "cover"
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

                                            <span
                                                className={
                                                    styles.cardNome
                                                }
                                            >
                                                {musica.nome}
                                            </span>

                                            <span
                                                className={
                                                    styles.cardArtista
                                                }
                                            >
                                                {musica.artista}
                                            </span>

                                        </div>


                                        {musica.notas &&
                                            musica.notas.length >
                                                0 && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirAnotacoes(
                                                            musica
                                                        )
                                                    }
                                                    className={
                                                        styles.notasButton
                                                    }
                                                >

                                                    <FiMessageCircle />

                                                    {
                                                        musica
                                                            .notas
                                                            .length
                                                    }

                                                </button>

                                            )}

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>


                {/* FAVORITAS */}

                <section className={styles.secao}>

                    <div
                        className={
                            styles.secaoHeader
                        }
                    >

                        <h2>

                            Suas favoritas

                            <FiHeart
                                className={
                                    styles.secaoIconFavoritas
                                }
                            />

                        </h2>


                        <p
                            className={
                                styles.secaoSubtituloFavoritas
                            }
                        >
                            As músicas que você marcou
                            como favoritas.
                        </p>

                    </div>


                    <div
                        className={
                            styles.listaFavoritas
                        }
                    >

                        {favoritas.length === 0 ? (

                            <div
                                className={
                                    styles.emptyStateFavoritas
                                }
                            >

                                <p
                                    className={
                                        styles.emptyStateSubMessage
                                    }
                                >
                                    Marque o coração ❤️ em
                                    uma música para adicioná-la
                                    aos seus favoritos!
                                </p>


                                <Link to="/cadastrarMusica">

                                    <button
                                        className={
                                            styles.emptyStateButtonFavoritas
                                        }
                                    >
                                        Ver minhas músicas
                                    </button>

                                </Link>

                            </div>

                        ) : (

                            favoritas.map(
                                (musica, indice) => (

                                    <div
                                        key={musica.id}
                                        className={
                                            styles.cardFavorita
                                        }
                                    >

                                        <div
                                            className={
                                                styles.cardCapa
                                            }
                                            style={{
                                                backgroundColor:
                                                    coresCapas[
                                                        (indice + 4) %
                                                        coresCapas.length
                                                    ]
                                            }}
                                        >

                                            {musica.capa ? (

                                                <img
                                                    src={
                                                        musica.capa
                                                    }
                                                    alt={
                                                        musica.nome
                                                    }
                                                    className={
                                                        styles.cardCapaImagem
                                                    }
                                                    style={{
                                                        width:
                                                            "100%",
                                                        height:
                                                            "100%",
                                                        objectFit:
                                                            "cover"
                                                    }}
                                                />

                                            ) : (

                                                <FiHeart
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

                                            <span
                                                className={
                                                    styles.favoritaNome
                                                }
                                            >
                                                {musica.nome}
                                            </span>

                                            <span
                                                className={
                                                    styles.favoritaArtista
                                                }
                                            >
                                                {musica.artista}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </section>

            </main>


            {/* MODAL DE ANOTAÇÕES */}

            {modalNotas.musicaId && (

                <div
                    className={
                        styles.modalOverlay
                    }
                    onClick={fecharAnotacoes}
                >

                    <div
                        className={
                            styles.modal
                        }
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div
                            className={
                                styles.modalHeader
                            }
                        >

                            <h3>

                                <FiMessageCircle
                                    className={
                                        styles.modalIcon
                                    }
                                />

                                Anotações

                            </h3>


                            <button
                                type="button"
                                onClick={
                                    fecharAnotacoes
                                }
                                className={
                                    styles.modalClose
                                }
                            >
                                ✕
                            </button>

                        </div>


                        <div
                            className={
                                styles.modalBody
                            }
                        >

                            {modalNotas.notas.length === 0 ? (

                                <p
                                    className={
                                        styles.modalVazio
                                    }
                                >
                                    Nenhuma anotação para
                                    esta música.
                                </p>

                            ) : (

                                modalNotas.notas.map(
                                    (nota) => (

                                        <div
                                            key={nota.id}
                                            className={
                                                styles.modalNota
                                            }
                                        >

                                            <p
                                                className={
                                                    styles.modalTexto
                                                }
                                            >
                                                {nota.texto}
                                            </p>


                                            <span
                                                className={
                                                    styles.modalData
                                                }
                                            >

                                                {new Date(
                                                    nota.criadoEm
                                                ).toLocaleDateString(
                                                    "pt-BR",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    }
                                                )}

                                            </span>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Home;

import { useState } from "react";
import styles from "./Notas.module.css";
import { 
    FiSend, 
    FiTrash2, 
    FiX, 
    FiEdit2, 
    FiFeather,
    FiUser
} from "react-icons/fi";

function Notas({ musicas, setMusicas, musicaId, onClose }) {
    const [novaNota, setNovaNota] = useState("");
    const [editandoId, setEditandoId] = useState(null);
    const [textoEditando, setTextoEditando] = useState("");

    const musica = musicas.find(m => m.id === musicaId);
    const notas = musica?.notas || [];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!novaNota.trim()) return;

        const novaNotaObj = {
            id: Date.now(),
            texto: novaNota,
            criadoEm: new Date().toISOString()
        };

        setMusicas(musicas.map(m =>
            m.id === musicaId
                ? { ...m, notas: [...(m.notas || []), novaNotaObj] }
                : m
        ));

        setNovaNota("");
    };

    const handleDelete = (notaId) => {
        if (!window.confirm("Tem certeza que deseja excluir esta anotação?")) return;

        setMusicas(musicas.map(m =>
            m.id === musicaId
                ? { ...m, notas: m.notas.filter(n => n.id !== notaId) }
                : m
        ));
    };

    const handleEdit = (nota) => {
        setEditandoId(nota.id);
        setTextoEditando(nota.texto);
    };

    const handleSaveEdit = () => {
        if (!textoEditando.trim()) return;

        setMusicas(musicas.map(m =>
            m.id === musicaId
                ? { ...m, notas: m.notas.map(n =>
                    n.id === editandoId ? { ...n, texto: textoEditando } : n
                )}
                : m
        ));

        setEditandoId(null);
        setTextoEditando("");
    };

    const cancelarEdit = () => {
        setEditandoId(null);
        setTextoEditando("");
    };

    const formatarData = (data) => {
        const date = new Date(data);
        const hoje = new Date();
        const diff = hoje - date;
        const minutos = Math.floor(diff / 60000);
        const horas = Math.floor(diff / 3600000);
        const dias = Math.floor(diff / 86400000);

        if (minutos < 1) return "agora";
        if (minutos < 60) return `${minutos}min`;
        if (horas < 24) return `${horas}h`;
        if (dias < 7) return `${dias}d`;
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    return (
        <div className={styles.notas}>
            <div className={styles.header}>
                <h3>
                    <FiFeather className={styles.headerIcon} />
                    Minhas Anotações
                    <span className={styles.total}>{notas.length}</span>
                </h3>
                <button onClick={onClose} className={styles.closeButton}>
                    <FiX />
                </button>
            </div>

            <div className={styles.lista}>
                {notas.length === 0 ? (
                    <div className={styles.vazio}>
                        <FiFeather className={styles.vazioIcon} />
                        <p>Nenhuma anotação ainda.</p>
                        <span>Escreva algo sobre essa música...</span>
                    </div>
                ) : (
                    notas.map((nota) => (
                        <div key={nota.id} className={styles.nota}>
                            <div className={styles.notaHeader}>
                                <span className={styles.notaUsuario}>
                                    <FiUser className={styles.usuarioIcon} />
                                    du4ards_
                                </span>
                                <span className={styles.notaData}>{formatarData(nota.criadoEm)}</span>
                            </div>

                            {editandoId === nota.id ? (
                                <div className={styles.editContainer}>
                                    <textarea
                                        value={textoEditando}
                                        onChange={(e) => setTextoEditando(e.target.value)}
                                        className={styles.editTextarea}
                                        rows={3}
                                        autoFocus
                                        placeholder="O que você quer escrever?"
                                    />
                                    <div className={styles.editActions}>
                                        <button
                                            onClick={handleSaveEdit}
                                            className={styles.saveEditButton}
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            onClick={cancelarEdit}
                                            className={styles.cancelEditButton}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className={styles.texto}>{nota.texto}</p>
                            )}

                            <div className={styles.notaActions}>
                                {!editandoId && (
                                    <button
                                        onClick={() => handleEdit(nota)}
                                        className={styles.editButton}
                                        title="Editar"
                                    >
                                        <FiEdit2 />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(nota.id)}
                                    className={styles.deleteButton}
                                    title="Excluir"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        value={novaNota}
                        onChange={(e) => setNovaNota(e.target.value)}
                        placeholder="O que essa música significa para você?"
                        className={styles.input}
                    />
                    <button
                        type="submit"
                        disabled={!novaNota.trim()}
                        className={styles.sendButton}
                    >
                        <FiSend />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Notas;
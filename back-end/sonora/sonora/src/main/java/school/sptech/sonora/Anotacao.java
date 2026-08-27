package school.sptech.sonora;

import java.time.LocalDateTime;

public class Anotacao {
    private Integer id;
    private String texto;
    private LocalDateTime criadoEm;
    private Integer musicaId;

    public Anotacao() {}

    public Anotacao(Integer id, String texto, LocalDateTime criadoEm, Integer musicaId) {
        this.id = id;
        this.texto = texto;
        this.criadoEm = criadoEm;
        this.musicaId = musicaId;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public LocalDateTime getCriadoEm() { return criadoEm; }
    public void setCriadoEm(LocalDateTime criadoEm) { this.criadoEm = criadoEm; }

    public Integer getMusicaId() { return musicaId; }
    public void setMusicaId(Integer musicaId) { this.musicaId = musicaId; }
}

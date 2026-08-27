package school.sptech.sonora;

public class Musica {
    private Integer id;
    private String nome;
    private String artista;
    private String album;
    private Integer duracao;
    private String genero;
    private Boolean favorita;
    private String capa;           // 👈 CAPA DA MÚSICA (base64)
    private Integer usuarioId;     // 👈 ID DO USUÁRIO

    public Musica() {}

    public Musica(Integer id, String nome, String artista, String album, Integer duracao,
                  String genero, Boolean favorita, String capa, Integer usuarioId) {
        this.id = id;
        this.nome = nome;
        this.artista = artista;
        this.album = album;
        this.duracao = duracao;
        this.genero = genero;
        this.favorita = favorita;
        this.capa = capa;
        this.usuarioId = usuarioId;
    }

    // Getters e Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getArtista() { return artista; }
    public void setArtista(String artista) { this.artista = artista; }

    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }

    public Integer getDuracao() { return duracao; }
    public void setDuracao(Integer duracao) { this.duracao = duracao; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public Boolean getFavorita() { return favorita; }
    public void setFavorita(Boolean favorita) { this.favorita = favorita; }

    public String getCapa() { return capa; }
    public void setCapa(String capa) { this.capa = capa; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }
}
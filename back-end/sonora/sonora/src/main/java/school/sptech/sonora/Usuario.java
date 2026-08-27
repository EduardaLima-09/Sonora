package school.sptech.sonora;

public class Usuario {
    private Integer id;
    private String nomeCompleto;
    private String usuario;
    private String email;
    private String senha;

    public Usuario() {}

    public Usuario(Integer id, String nomeCompleto, String usuario, String email, String senha) {
        this.id = id;
        this.nomeCompleto = nomeCompleto;
        this.usuario = usuario;
        this.email = email;
        this.senha = senha;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
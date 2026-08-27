package school.sptech.sonora;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5174")
public class UsuarioController {

    private final JdbcTemplate template;

    public UsuarioController(JdbcTemplate template) {
        this.template = template;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario) {
        if (usuario.getNomeCompleto() == null || usuario.getNomeCompleto().isBlank()
                || usuario.getUsuario() == null || usuario.getUsuario().isBlank()
                || usuario.getEmail() == null || usuario.getEmail().isBlank()
                || usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        String sqlBusca = "SELECT * FROM usuario WHERE usuario = ? OR email = ?";
        List<Usuario> usuarios = template.query(sqlBusca,
                new BeanPropertyRowMapper<>(Usuario.class),
                usuario.getUsuario(), usuario.getEmail());

        if (!usuarios.isEmpty()) {
            return ResponseEntity.status(409).build();
        }

        String sql = "INSERT INTO usuario (nome_completo, usuario, email, senha) VALUES (?, ?, ?, ?)";
        KeyHolder holder = new GeneratedKeyHolder();

        template.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, usuario.getNomeCompleto());
            statement.setString(2, usuario.getUsuario());
            statement.setString(3, usuario.getEmail());
            statement.setString(4, usuario.getSenha());
            return statement;
        }, holder);

        usuario.setId(holder.getKey().intValue());
        usuario.setSenha(null);
        return ResponseEntity.status(201).body(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Usuario usuario) {
        if (usuario.getUsuario() == null || usuario.getUsuario().isBlank()
                || usuario.getSenha() == null || usuario.getSenha().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        String sql = "SELECT * FROM usuario WHERE usuario = ? AND senha = ?";

        try {
            Usuario usuarioLogado = template.queryForObject(sql,
                    new BeanPropertyRowMapper<>(Usuario.class),
                    usuario.getUsuario(), usuario.getSenha());

            usuarioLogado.setSenha(null);
            return ResponseEntity.ok(usuarioLogado);

        } catch (EmptyResultDataAccessException exception) {
            return ResponseEntity.status(401).build();
        }
    }
}
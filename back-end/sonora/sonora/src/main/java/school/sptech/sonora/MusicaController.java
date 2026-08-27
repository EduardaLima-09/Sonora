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
@RequestMapping("/musicas")
@CrossOrigin(origins = "http://localhost:5174")
public class MusicaController {

    private final JdbcTemplate template;

    public MusicaController(JdbcTemplate template) {
        this.template = template;
    }

    // ==========================================
    // LISTAR MÚSICAS DE UM USUÁRIO
    // ==========================================
    @GetMapping
    public ResponseEntity<List<Musica>> listar(@RequestParam Integer usuarioId) {
        String sql = "SELECT * FROM musica WHERE usuario_id = ? ORDER BY id DESC";
        List<Musica> musicas = template.query(sql, new BeanPropertyRowMapper<>(Musica.class), usuarioId);
        return ResponseEntity.ok(musicas);
    }

    // ==========================================
    // BUSCAR MÚSICA POR ID
    // ==========================================
    @GetMapping("/{id}")
    public ResponseEntity<Musica> buscarPorId(@PathVariable Integer id) {
        String sql = "SELECT * FROM musica WHERE id = ?";

        try {
            Musica musica = template.queryForObject(sql, new BeanPropertyRowMapper<>(Musica.class), id);
            return ResponseEntity.status(200).body(musica);
        } catch (EmptyResultDataAccessException exception) {
            return ResponseEntity.status(404).build();
        }
    }

    // ==========================================
    // CADASTRAR MÚSICA (COM CAPA E USUARIO_ID)
    // ==========================================
    @PostMapping
    public ResponseEntity<Musica> cadastrar(@RequestBody Musica musica) {
        // Validação
        if (musica.getNome() == null || musica.getNome().isBlank()
                || musica.getArtista() == null || musica.getArtista().isBlank()
                || musica.getAlbum() == null || musica.getAlbum().isBlank()
                || musica.getDuracao() == null || musica.getDuracao() <= 0
                || musica.getUsuarioId() == null) {
            return ResponseEntity.status(400).build();
        }

        // Verifica duplicidade para o mesmo usuário
        String sqlBusca = """
            SELECT *
            FROM musica
            WHERE LOWER(nome) = LOWER(?)
            AND LOWER(artista) = LOWER(?)
            AND usuario_id = ?
            """;

        List<Musica> musicas = template.query(sqlBusca, new BeanPropertyRowMapper<>(Musica.class),
                musica.getNome(), musica.getArtista(), musica.getUsuarioId());

        if (!musicas.isEmpty()) {
            return ResponseEntity.status(409).body(musica);
        }

        // Insere com todos os campos
        String sql = "INSERT INTO musica (nome, artista, album, duracao, genero, favorita, capa, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        KeyHolder holder = new GeneratedKeyHolder();

        template.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, musica.getNome());
            statement.setString(2, musica.getArtista());
            statement.setString(3, musica.getAlbum());
            statement.setInt(4, musica.getDuracao());
            statement.setString(5, musica.getGenero() != null ? musica.getGenero() : "");
            statement.setBoolean(6, musica.getFavorita() != null && musica.getFavorita());
            statement.setString(7, musica.getCapa() != null ? musica.getCapa() : "");  // 👈 CAPA
            statement.setInt(8, musica.getUsuarioId());
            return statement;
        }, holder);

        musica.setId(holder.getKey().intValue());
        return ResponseEntity.status(201).body(musica);
    }

    // ==========================================
    // ATUALIZAR MÚSICA
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<Musica> atualizar(@RequestBody Musica musica, @PathVariable int id) {
        if (!existePorId(id)) {
            return ResponseEntity.status(404).build();
        }

        if (musica.getNome() == null || musica.getNome().isBlank()
                || musica.getArtista() == null || musica.getArtista().isBlank()
                || musica.getAlbum() == null || musica.getAlbum().isBlank()
                || musica.getDuracao() == null || musica.getDuracao() <= 0) {
            return ResponseEntity.status(400).build();
        }

        String sql = "UPDATE musica SET nome = ?, artista = ?, album = ?, duracao = ?, genero = ?, favorita = ?, capa = ? WHERE id = ? AND usuario_id = ?";

        int rowsAffected = template.update(sql,
                musica.getNome(),
                musica.getArtista(),
                musica.getAlbum(),
                musica.getDuracao(),
                musica.getGenero() != null ? musica.getGenero() : "",
                musica.getFavorita() != null && musica.getFavorita(),
                musica.getCapa() != null ? musica.getCapa() : "",
                id,
                musica.getUsuarioId()
        );

        if (rowsAffected == 0) {
            return ResponseEntity.status(403).build();
        }

        musica.setId(id);
        return ResponseEntity.status(200).body(musica);
    }

    // ==========================================
    // DELETAR MÚSICA
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable int id, @RequestParam Integer usuarioId) {
        if (!existePorId(id)) {
            return ResponseEntity.status(404).build();
        }

        String sql = "DELETE FROM musica WHERE id = ? AND usuario_id = ?";
        int rowsAffected = template.update(sql, id, usuarioId);

        if (rowsAffected == 0) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.status(204).build();
    }

    // ==========================================
    // FAVORITAR / DESFAVORITAR
    // ==========================================
    @PatchMapping("/{id}/favoritar")
    public ResponseEntity<Musica> favoritar(@PathVariable int id, @RequestParam Integer usuarioId) {
        if (!existePorId(id)) {
            return ResponseEntity.status(404).build();
        }

        String sqlCheck = "SELECT COUNT(*) FROM musica WHERE id = ? AND usuario_id = ?";
        Integer count = template.queryForObject(sqlCheck, Integer.class, id, usuarioId);

        if (count == null || count == 0) {
            return ResponseEntity.status(403).build();
        }

        String sql = "UPDATE musica SET favorita = NOT favorita WHERE id = ?";
        template.update(sql, id);

        String sqlBusca = "SELECT * FROM musica WHERE id = ?";
        Musica musica = template.queryForObject(sqlBusca, new BeanPropertyRowMapper<>(Musica.class), id);
        return ResponseEntity.ok(musica);
    }

    private boolean existePorId(int id) {
        String sql = "SELECT COUNT(*) FROM musica WHERE id = ?";
        Integer quantidade = template.queryForObject(sql, Integer.class, id);
        return quantidade != null && quantidade > 0;
    }
}
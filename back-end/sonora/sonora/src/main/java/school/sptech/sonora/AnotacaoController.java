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
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/anotacoes")
@CrossOrigin(origins = "http://localhost:5174")
public class AnotacaoController {

    private final JdbcTemplate template;

    public AnotacaoController(JdbcTemplate template) {
        this.template = template;
    }

    // ==========================================
    // LISTAR ANOTAÇÕES DE UMA MÚSICA
    // ==========================================
    @GetMapping("/musica/{musicaId}")
    public ResponseEntity<List<Anotacao>> listarPorMusica(@PathVariable Integer musicaId) {
        String sql = "SELECT * FROM anotacao WHERE musica_id = ? ORDER BY criado_em DESC";
        List<Anotacao> anotacoes = template.query(sql, new BeanPropertyRowMapper<>(Anotacao.class), musicaId);
        return ResponseEntity.ok(anotacoes);
    }

    // ==========================================
    // ADICIONAR ANOTAÇÃO
    // ==========================================
    @PostMapping
    public ResponseEntity<Anotacao> adicionar(@RequestBody Anotacao anotacao) {
        if (anotacao.getTexto() == null || anotacao.getTexto().isBlank()
                || anotacao.getMusicaId() == null) {
            return ResponseEntity.status(400).build();
        }

        String sql = "INSERT INTO anotacao (texto, criado_em, musica_id) VALUES (?, ?, ?)";
        KeyHolder holder = new GeneratedKeyHolder();

        template.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, anotacao.getTexto());
            statement.setObject(2, LocalDateTime.now());
            statement.setInt(3, anotacao.getMusicaId());
            return statement;
        }, holder);

        anotacao.setId(holder.getKey().intValue());
        anotacao.setCriadoEm(LocalDateTime.now());
        return ResponseEntity.status(201).body(anotacao);
    }

    // ==========================================
    // ATUALIZAR ANOTAÇÃO
    // ==========================================
    @PutMapping("/{id}")
    public ResponseEntity<Anotacao> atualizar(@PathVariable int id, @RequestBody Anotacao anotacao) {
        if (!existePorId(id)) {
            return ResponseEntity.status(404).build();
        }

        if (anotacao.getTexto() == null || anotacao.getTexto().isBlank()) {
            return ResponseEntity.status(400).build();
        }

        String sql = "UPDATE anotacao SET texto = ? WHERE id = ?";
        template.update(sql, anotacao.getTexto(), id);

        anotacao.setId(id);
        return ResponseEntity.ok(anotacao);
    }

    // ==========================================
    // DELETAR ANOTAÇÃO
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {
        if (!existePorId(id)) {
            return ResponseEntity.status(404).build();
        }

        String sql = "DELETE FROM anotacao WHERE id = ?";
        template.update(sql, id);
        return ResponseEntity.status(204).build();
    }

    private boolean existePorId(int id) {
        String sql = "SELECT COUNT(*) FROM anotacao WHERE id = ?";
        Integer quantidade = template.queryForObject(sql, Integer.class, id);
        return quantidade != null && quantidade > 0;
    }
}
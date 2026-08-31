const API_URL = 'http://localhost:8080';

export const api = {

    // Cadastrando usuários
    cadastrarUsuario: async (dados) => {
        const response = await fetch(`${API_URL}/usuarios/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.status === 409) {
            throw new Error('Usuário ou e-mail já cadastrado');
        }
        if (!response.ok) {
            throw new Error('Erro ao cadastrar usuário');
        }
        return await response.json();
    },

    // Cadastrado ele faz o login na Sonora
    login: async (dados) => {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.status === 401) {
            throw new Error('Usuário ou senha incorretos');
        }
        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }
        return await response.json();
    },


    // Pega as músicas com a capa(imagem)
    getMusicas: async (usuarioId) => {
        const response = await fetch(`${API_URL}/musicas?usuarioId=${usuarioId}`);
        if (!response.ok) throw new Error('Erro ao buscar músicas');
        return await response.json();
    },

    // Mostra as músicas na tela, verifica se ela existe e tals...
    postMusica: async (musica) => {
        const response = await fetch(`${API_URL}/musicas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(musica)
        });

        if (response.status === 409) {
            throw new Error('Música já cadastrada');
        }
        if (!response.ok) {
            throw new Error('Erro ao cadastrar música');
        }
        return await response.json();
    },

    // Podemos editar as informações das músicas
    putMusica: async (id, musica) => {
        const response = await fetch(`${API_URL}/musicas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(musica)
        });

        if (response.status === 403) {
            throw new Error('Você não tem permissão para editar esta música');
        }
        if (!response.ok) {
            throw new Error('Erro ao atualizar música');
        }
        return await response.json();
    },

    // Deletamos as músicas
    deleteMusica: async (id, usuarioId) => {
        const response = await fetch(`${API_URL}/musicas/${id}?usuarioId=${usuarioId}`, {
            method: 'DELETE'
        });

        if (response.status === 403) {
            throw new Error('Você não tem permissão para excluir esta música');
        }
        if (!response.ok) {
            throw new Error('Erro ao deletar música');
        }
        return true;
    },

    // Função responsável por favoritar uma música.
    // Recebe o ID da música e o ID do usuário e envia uma requisição PATCH para a API.
    // Se o usuário não tiver permissão, retorna um erro 403.
    // Caso aconteça outro erro, também informa que não foi possível favoritar.
    // Se der tudo certo, retorna os dados atualizados da música.
    
    patchFavoritar: async (id, usuarioId) => {
        const response = await fetch(`${API_URL}/musicas/${id}/favoritar?usuarioId=${usuarioId}`, {
            method: 'PATCH'
        });

        if (response.status === 403) {
            throw new Error('Você não tem permissão para favoritar esta música');
        }
        if (!response.ok) {
            throw new Error('Erro ao favoritar música');
        }
        return await response.json();
    },

    getAnotacoes: async (musicaId) => {
        const response = await fetch(`${API_URL}/anotacoes/musica/${musicaId}`);
        if (!response.ok) throw new Error('Erro ao buscar anotações');
        return await response.json();
    },

    postAnotacao: async (dados) => {
        const response = await fetch(`${API_URL}/anotacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error('Erro ao adicionar anotação');
        }
        return await response.json();
    },

    putAnotacao: async (id, dados) => {
        const response = await fetch(`${API_URL}/anotacoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar anotação');
        }
        return await response.json();
    },

    deleteAnotacao: async (id) => {
        const response = await fetch(`${API_URL}/anotacoes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar anotação');
        }
        return true;
    }
};

export default api;
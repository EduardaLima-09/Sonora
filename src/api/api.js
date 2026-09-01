
import axios from "axios";

const API_URL = "http://localhost:8080";

export const api = {

    // Cadastrando usuários
    cadastrarUsuario: async (dados) => {
        try {
            const response = await axios.post(
                `${API_URL}/usuarios/cadastro`,
                dados
            );

            return response.data;

        } catch (erro) {

            if (erro.response?.status === 409) {
                throw new Error("Usuário ou e-mail já cadastrado");
            }

            throw new Error("Erro ao cadastrar usuário");
        }
    },


    // Cadastrado ele faz o login na Sonora
    login: async (dados) => {
        try {
            const response = await axios.post(
                `${API_URL}/usuarios/login`,
                dados
            );

            return response.data;

        } catch (erro) {

            if (erro.response?.status === 401) {
                throw new Error("Usuário ou senha incorretos");
            }

            throw new Error("Erro ao fazer login");
        }
    },


    // Pega as músicas com a capa (imagem)
    getMusicas: async (usuarioId) => {
        try {
            const response = await axios.get(
                `${API_URL}/musicas`,
                {
                    params: {
                        usuarioId: usuarioId
                    }
                }
            );

            return response.data;

        } catch (erro) {
            throw new Error("Erro ao buscar músicas");
        }
    },


    // Mostra as músicas na tela, verifica se ela existe e etc.
    postMusica: async (musica) => {
        try {
            const response = await axios.post(
                `${API_URL}/musicas`,
                musica
            );

            return response.data;

        } catch (erro) {

            if (erro.response?.status === 409) {
                throw new Error("Música já cadastrada");
            }

            throw new Error("Erro ao cadastrar música");
        }
    },


    // Podemos editar as informações das músicas
    putMusica: async (id, musica) => {
        try {
            const response = await axios.put(
                `${API_URL}/musicas/${id}`,
                musica
            );

            return response.data;

        } catch (erro) {

            if (erro.response?.status === 403) {
                throw new Error(
                    "Você não tem permissão para editar esta música"
                );
            }

            throw new Error("Erro ao atualizar música");
        }
    },


    // Deletamos as músicas
    deleteMusica: async (id, usuarioId) => {
        try {
            await axios.delete(
                `${API_URL}/musicas/${id}`,
                {
                    params: {
                        usuarioId: usuarioId
                    }
                }
            );

            return true;

        } catch (erro) {

            if (erro.response?.status === 403) {
                throw new Error(
                    "Você não tem permissão para excluir esta música"
                );
            }

            throw new Error("Erro ao deletar música");
        }
    },


    // Função responsável por favoritar uma música
    patchFavoritar: async (id, usuarioId) => {
        try {
            const response = await axios.patch(
                `${API_URL}/musicas/${id}/favoritar`,
                null,
                {
                    params: {
                        usuarioId: usuarioId
                    }
                }
            );

            return response.data;

        } catch (erro) {

            if (erro.response?.status === 403) {
                throw new Error(
                    "Você não tem permissão para favoritar esta música"
                );
            }

            throw new Error("Erro ao favoritar música");
        }
    },


    // Busca as anotações de uma música
    getAnotacoes: async (musicaId) => {
        try {
            const response = await axios.get(
                `${API_URL}/anotacoes/musica/${musicaId}`
            );

            return response.data;

        } catch (erro) {
            throw new Error("Erro ao buscar anotações");
        }
    },


    // Adiciona uma anotação
    postAnotacao: async (dados) => {
        try {
            const response = await axios.post(
                `${API_URL}/anotacoes`,
                dados
            );

            return response.data;

        } catch (erro) {
            throw new Error("Erro ao adicionar anotação");
        }
    },


    // Atualiza uma anotação
    putAnotacao: async (id, dados) => {
        try {
            const response = await axios.put(
                `${API_URL}/anotacoes/${id}`,
                dados
            );

            return response.data;

        } catch (erro) {
            throw new Error("Erro ao atualizar anotação");
        }
    },


    // Deleta uma anotação
    deleteAnotacao: async (id) => {
        try {
            await axios.delete(
                `${API_URL}/anotacoes/${id}`
            );

            return true;

        } catch (erro) {
            throw new Error("Erro ao deletar anotação");
        }
    }
};

export default api;

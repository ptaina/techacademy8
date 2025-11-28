import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { Camera } from "lucide-react";

// URL base para carregar as imagens do servidor
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const EditUserPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Estado para armazenar o arquivo selecionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Estado para o preview (se tiver foto no banco, monta a URL completa)
  const [preview, setPreview] = useState<string | null>(
    user?.profileImage ? `${API_URL}/uploads/${user.profileImage}` : null
  );

  // --- Validação no Frontend ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // 1. Validação de Tamanho (Limite de 5MB)
      // 5 * 1024 * 1024 bytes
      if (file.size > 5 * 1024 * 1024) {
        setError("Arquivo muito grande! O tamanho máximo é de 5MB.");
        return;
      }

      // 2. Validação de Tipo (Mimetype)
      // Aceita apenas se começar com "image/" (ex: image/png, image/jpeg)
      if (!file.type.startsWith("image/")) {
        setError("Tipo de arquivo inválido. Apenas imagens são permitidas.");
        return;
      }

      // Se passou nas validações, limpa erros e atualiza o estado
      setError(null);
      setSelectedFile(file);

      // Cria uma URL temporária para mostrar o preview IMEDIATAMENTE
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- Envio com FormData ---
  const handleUpload = async () => {
    if (!selectedFile) return;

    // Para enviar arquivos binários, o JSON não serve.
    // Temos que usar a interface FormData do JavaScript.
    const formData = new FormData();

    // 'avatar' é a chave que o Multer espera no backend (upload.single('avatar'))
    formData.append("avatar", selectedFile);

    try {
      // O header 'Content-Type': 'multipart/form-data' é essencial aqui
      const res = await api.post("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Atualiza o localStorage com o novo nome da imagem recebido do servidor
      // Isso garante que a foto apareça no menu lateral e outras telas sem precisar relogar
      if (user) {
        const updatedUser = { ...user, profileImage: res.data.profileImage };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Recarrega a página para atualizar o contexto de autenticação globalmente
        window.location.reload();
      }
    } catch (err) {
      console.error("Erro no upload", err);
      // Lança o erro para ser capturado no handleSubmit e mostrar mensagem
      throw new Error("Falha ao enviar a imagem para o servidor.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Prioridade 1: Se tem arquivo, tenta fazer o upload primeiro
    if (selectedFile) {
      try {
        await handleUpload();
      } catch (err) {
        setError("Erro ao salvar a foto de perfil.");
        return; // Para tudo se a foto falhar
      }
    }

    // Se o usuário só queria trocar a foto (não mexeu em senha nem nome), paramos aqui
    if (!password && name === user?.name && selectedFile) {
      return;
    }

    // Validações de senha
    if (password && password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
        );
        return;
      }
    }

    // Monta o objeto de atualização apenas com o que mudou
    const updates: { name?: string; password?: string } = {};
    if (name && name !== user?.name) updates.name = name;
    if (password) updates.password = password;

    if (Object.keys(updates).length === 0 && !selectedFile) {
      setError("Nenhuma alteração foi feita.");
      return;
    }

    // Envia atualização de texto (Nome/Senha) para o backend
    if (Object.keys(updates).length > 0 && user) {
      try {
        await api.put(`/users/${user.id}`, updates);
        setSuccess("Perfil atualizado com sucesso!");
        setPassword("");
        setConfirmPassword("");

        // Se mudou o nome, atualiza no storage também
        if (updates.name) {
          const updatedUser = {
            ...user,
            name: updates.name,
            ...(selectedFile ? {} : {}),
          };
          // Nota: Se já atualizou a imagem no reload acima, o user do contexto pode estar desatualizado aqui,
          // mas o reload do handleUpload já resolveu. Se só mudou texto, atualizamos aqui:
          if (!selectedFile) {
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.location.reload();
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Ocorreu um erro inesperado ao atualizar o perfil.");
        }
      }
    } else if (selectedFile) {
      // Caso tenha caído aqui (só foto), o reload do handleUpload já aconteceu ou vai acontecer
      setSuccess("Foto de perfil atualizada!");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Editar Perfil
      </h1>

      {/* ÁREA DE UPLOAD DA FOTO (UI) */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative w-32 h-32 mb-4">
          {/* Círculo da Imagem */}
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-4 border-blue-100 shadow-sm">
            {preview ? (
              <img
                src={preview}
                alt="Foto de Perfil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback se a imagem não carregar (ex: servidor caiu)
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/150?text=Erro";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera size={40} />
              </div>
            )}
          </div>

          {/* Botão flutuante da Câmera */}
          <label
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-transform hover:scale-110"
            title="Alterar foto"
          >
            <Camera size={20} />
            <input
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/jpg" // Filtro nativo do navegador
              onChange={handleFileChange}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">Permitido: JPG, PNG (Máx. 5MB)</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <Input
          label="Nome Completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Nova Senha (deixe em branco para não alterar)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirmar Nova Senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center font-medium bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        <div className="flex space-x-4 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full px-4 py-2 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors"
          >
            Voltar
          </button>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;

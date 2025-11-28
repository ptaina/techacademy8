import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import api from "../services/api";
import { cpf } from "cpf-cnpj-validator";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userCpf, setUserCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("patient"); // ← estado para papel do usuário
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!cpf.isValid(userCpf)) {
      setError("CPF inválido.");
      return;
    }
    try {
      await api.post("/users", {
        name,
        email,
        cpf: userCpf.replace(/\D/g, ""),
        password,
        role, // ← envia o papel escolhido no cadastro
      });
      setSuccess(
        "Registo realizado com sucesso! A redirecionar para o login..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Criar Conta
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome Completo"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="CPF"
          type="text"
          value={userCpf}
          onChange={(e) => setUserCpf(e.target.value)}
          placeholder="000.000.000-00"
          required
        />
        {/* Campo para seleção do papel do usuário */}
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          Tipo de Usuário
        </label>
        <select
          className="mb-4 p-2 w-full rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="patient">Paciente</option>
          <option value="admin">Administrador</option>
        </select>
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirmar Senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm text-center">{success}</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Registrar
        </button>
      </form>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Já tem uma conta?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

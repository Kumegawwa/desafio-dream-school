"use client"; // Diz ao Next.js que esta página interage com o usuário (precisa rodar no cliente)

import { useState } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário

    try {
      const resposta = await fetch("http://localhost:3001/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, telefone }),
      });

      if (resposta.ok) {
        setMensagem("🎉 Cadastro realizado com sucesso!");
        setNome("");
        setEmail("");
        setTelefone("");
      } else {
        setMensagem("❌ Erro ao realizar o cadastro. Tente novamente.");
      }
    } catch (error) {
      setMensagem("❌ Erro de conexão com o servidor.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">
          The Dream School
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Garanta sua vaga na melhor escola de tecnologia.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Digite seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="(00) 00000-0000"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 mt-2"
          >
            Quero me cadastrar
          </button>
        </form>

        {mensagem && (
          <div className="mt-4 text-center font-medium text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-200">
            {mensagem}
          </div>
        )}
      </div>
    </main>
  );
}
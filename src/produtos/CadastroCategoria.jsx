import React, { useState } from 'react';

// 1. Recebe a função 'onCategoriaAdicionada' como prop
function CadastroCategoria({ onCategoriaAdicionada }) {
  const [nomeCategoria, setNomeCategoria] = useState('');

  const handleAdicionarCategoria = (event) => {
    event.preventDefault();
    if (!nomeCategoria.trim()) return; // Impede adicionar categoria vazia

    const novaCategoria = { 
      id: Date.now(), // Adiciona um ID único
      nome: nomeCategoria 
    };

    // 2. Chama a função do App.js para adicionar a categoria na lista principal
    onCategoriaAdicionada(novaCategoria);

    alert(`Categoria "${novaCategoria.nome}" cadastrada com sucesso!`);
    setNomeCategoria(''); // Limpa o campo
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Cadastrar Nova Categoria
      </h1>
      <form onSubmit={handleAdicionarCategoria} className="space-y-6">
        <div>
          <label htmlFor="nomeCategoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome da Categoria
          </label>
          <input id="nomeCategoria" type="text" value={nomeCategoria} onChange={(e) => setNomeCategoria(e.target.value)} placeholder="Ex: Eletrônicos" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
          Adicionar Categoria
        </button>
      </form>
    </div>
  );
}

export default CadastroCategoria;
// Arquivo: src/produtos/ListaCategorias.jsx

import React from 'react';

// 1. Recebe a lista de 'categorias' e a função 'onRemoverCategoria'
function ListaCategorias({ categorias, onRemoverCategoria }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Categorias Cadastradas
      </h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {categorias.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">Nenhuma categoria cadastrada.</p>
        ) : (
          categorias.map((categoria) => (
            <div key={categoria.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-white">{categoria.nome}</span>
              {/* 2. Botão de Remover que chama a função passada via props */}
              <button
                onClick={() => onRemoverCategoria(categoria.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-xs transition-colors"
                title="Remover Categoria"
              >
                X
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListaCategorias;
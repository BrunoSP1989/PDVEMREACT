import React from 'react';

// 1. Recebe as novas funções onEditar e onDeletar
function ListaProdutos({ produtos, onEditar, onDeletar }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Produtos Cadastrados
      </h2>
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {produtos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">Nenhum produto cadastrado ainda.</p>
        ) : (
          produtos.map((produto) => (
            <div key={produto.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center">
              {/* Informações do produto */}
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{produto.nome}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{produto.categoria}</p>
                <div className="flex space-x-4 mt-2 text-sm">
                  <p className="font-semibold text-gray-800 dark:text-white">R$ {produto.preco.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 self-center">Estoque: {produto.estoque}</p>
                </div>
              </div>
              {/* 2. Botões de Ação (Editar e Deletar) */}
              <div className="flex space-x-2 self-end md:self-center">
                <button
                  onClick={() => onEditar(produto)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeletar(produto.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ListaProdutos;
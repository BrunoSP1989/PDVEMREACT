import React from 'react';

function ModalProdutos({ isOpen, onClose, produtos, onProdutoSelect }) {
    // Se não estiver aberto, não renderiza nada
    if (!isOpen) return null;

    return (
        // Overlay (fundo escuro)
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center p-4"
        >
            {/* Conteúdo do Modal */}
            <div
                onClick={(e) => e.stopPropagation()} // Impede que o clique no modal feche-o
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            >
                {/* Cabeçalho */}
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Selecione um Produto</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white font-bold text-2xl">&times;</button>
                </div>

                {/* Lista de Produtos */}
                <div className="p-6 space-y-3 overflow-y-auto">
                    {produtos.map(produto => (
                        <div
                            key={produto.id}
                            onClick={() => onProdutoSelect(produto)} // Seleciona o produto e fecha o modal
                            className={`p-4 flex justify-between items-center rounded-lg transition-colors duration-200
                ${produto.estoque > 0
                                    ? 'cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700'
                                    : 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                                }`
                            }
                            aria-disabled={produto.estoque === 0}
                        >
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{produto.nome}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{produto.categoria}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-gray-800 dark:text-white">R$ {produto.preco.toFixed(2)}</p>
                                <p className={`text-sm ${produto.estoque > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    Estoque: {produto.estoque}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ModalProdutos;
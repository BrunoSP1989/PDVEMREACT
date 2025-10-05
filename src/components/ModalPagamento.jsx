import React, { useState } from 'react';

// Lista de formas de pagamento que poderíamos buscar de um backend no futuro
const formasDePagamento = [
    'Dinheiro',
    'Cartão de Crédito',
    'Cartão de Débito',
    'PIX'
];

function ModalPagamento({ isOpen, onClose, onConfirm, totalVenda }) {
    const [formaSelecionada, setFormaSelecionada] = useState(formasDePagamento[0]);

    if (!isOpen) return null;

    const handleConfirmar = () => {
        onConfirm(formaSelecionada); // Envia a forma de pagamento selecionada de volta
    };

    return (
        // Overlay
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
        >
            {/* Conteúdo do Modal */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md"
            >
                {/* Cabeçalho */}
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white">Forma de Pagamento</h2>
                </div>

                {/* Corpo */}
                <div className="p-6">
                    <div className="flex justify-between items-center text-2xl font-bold mb-6">
                        <span className="text-gray-800 dark:text-white">TOTAL A PAGAR</span>
                        <span className="text-green-500">R$ {totalVenda.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecione uma opção:</label>
                        {formasDePagamento.map(forma => (
                            <div
                                key={forma}
                                onClick={() => setFormaSelecionada(forma)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${formaSelecionada === forma
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 ring-2 ring-blue-500'
                                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className="font-semibold text-gray-900 dark:text-white">{forma}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rodapé com Botões */}
                <div className="p-4 border-t dark:border-gray-700 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirmar}
                        className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors"
                    >
                        Confirmar Pagamento
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalPagamento;
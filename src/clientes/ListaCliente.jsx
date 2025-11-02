import React from 'react';

// O componente recebe 'clientes' através das 'props'
function ListaCliente({ clientes, onEditar, onDeletar }) {
    // Para simplificar, desestruturamos a prop 'clientes'




   return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Lista de Clientes Cadastrados
            </h2>

            {/* Verifica se a lista de clientes está vazia */}
            {clientes.length === 0 ? (
                // Se estiver vazia, mostra uma mensagem
                <p className="text-gray-600 dark:text-gray-400">Nenhum cliente cadastrado ainda.</p>
            ) : (
                // Se houver clientes, mostra a tabela
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Cabeçalho da Tabela */}
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Telefone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Endereço</th>
                                {/* Adicionamos a coluna de Ações no cabeçalho */}
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th> 
                            </tr>
                        </thead>

                        {/* Corpo da Tabela */}
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {clientes.map((cliente, index) => (
                                // Usamos o ID do cliente como key, se existir, senão o index
                                <tr key={cliente.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                        {cliente.nome}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {cliente.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {cliente.telefone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {cliente.endereco}
                                    </td>
                                    
                                    {/* ✨ CORREÇÃO: Nova célula <td> para as ações */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex space-x-2 justify-center">
                                            <button
                                                // CORREÇÃO: Passamos o objeto 'cliente' atual
                                                onClick={() => onEditar(cliente)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                // CORREÇÃO: Passamos o 'cliente.id' para deletar
                                                onClick={() => onDeletar(cliente.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ListaCliente;
import React, { useState } from 'react';

function TelaVendasRegistradas({ vendas }) {
    // Estado para controlar qual venda está com os detalhes expandidos
    const [vendaExpandidaId, setVendaExpandidaId] = useState(null);

    const toggleDetalhes = (idVenda) => {
        // Se a venda clicada já estiver expandida, fecha ela. Senão, abre.
        setVendaExpandidaId(vendaExpandidaId === idVenda ? null : idVenda);
    };

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const formatarMoeda = (valor) => {
        // Adiciona uma verificação para evitar erro se 'valor' for undefined ou nulo
        if (typeof valor !== 'number') {
            return 'R$ 0,00';
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="container mx-auto p-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Histórico de Vendas
            </h1>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID da Venda</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3 text-center">Itens</th>
                            <th scope="col" className="px-6 py-3 text-right">Valor Total</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendas.length > 0 ? (
                            vendas.map((venda) => (
                                <React.Fragment key={venda.id}>
                                    {/* Linha principal com os dados da venda */}
                                    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            VENDA-{venda.id}
                                        </th>
                                        <td className="px-6 py-4">{formatarData(venda.data)}</td>
                                        <td className="px-6 py-4 text-center">{venda.itens.length}</td>
                                        <td className="px-6 py-4 text-right font-semibold">{formatarMoeda(venda.total)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => toggleDetalhes(venda.id)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                {vendaExpandidaId === venda.id ? 'Fechar' : 'Ver Detalhes'}
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Linha de detalhes (renderizada condicionalmente) */}
                                    {vendaExpandidaId === venda.id && (
                                        <tr className="bg-gray-50 dark:bg-gray-700">
                                            <td colSpan="5" className="p-4">
                                                <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-inner">
                                                    {/* SEÇÃO ADICIONADA PARA MOSTRAR A FORMA DE PAGAMENTO */}
                                                    <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
                                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Forma de Pagamento:</span>
                                                        <span className="px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-md dark:bg-green-700 dark:text-green-100">
                                                            {venda.formaPagamento || 'Não informada'}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-md font-bold text-gray-800 dark:text-white mb-3">Produtos Vendidos:</h4>
                                                    <ul className="space-y-2">
                                                        {venda.itens.map(item => (
                                                            <li key={item.id} className="flex justify-between items-center text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                                                                <span>{item.nome}</span>
                                                                <span className="text-right font-mono">
                                                                    {item.quantidade} x {formatarMoeda(item.preco)} = <strong>{formatarMoeda(item.quantidade * item.preco)}</strong>
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    Nenhuma venda registrada ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TelaVendasRegistradas;


import React, { useState, useMemo } from 'react';

function TelaVendasRegistradas({ vendas }) {
    const [vendaExpandidaId, setVendaExpandidaId] = useState(null);
    // 1. Estados para controlar os filtros de data
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const toggleDetalhes = (idVenda) => {
        setVendaExpandidaId(vendaExpandidaId === idVenda ? null : idVenda);
    };

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        // Adiciona o fuso horário para garantir que a data não mude
        const offset = data.getTimezoneOffset();
        const dataAjustada = new Date(data.getTime() + (offset * 60 * 1000));
        return dataAjustada.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const formatarMoeda = (valor) => {
        if (typeof valor !== 'number') {
            return 'R$ 0,00';
        }
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // 2. Lógica para filtrar as vendas com base nas datas selecionadas
    const vendasFiltradas = useMemo(() => {
        if (!dataInicio && !dataFim) {
            return vendas; // Se não houver filtro, retorna todas as vendas
        }

        // Define o início do dia para a data de início e o fim do dia para a data de fim
        const inicio = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;
        const fim = dataFim ? new Date(dataFim + 'T23:59:59') : null;

        return vendas.filter(venda => {
            const dataVenda = new Date(venda.data);
            if (inicio && dataVenda < inicio) {
                return false;
            }
            if (fim && dataVenda > fim) {
                return false;
            }
            return true;
        });
    }, [vendas, dataInicio, dataFim]);

    // Função para limpar os filtros de data
    const limparFiltros = () => {
        setDataInicio('');
        setDataFim('');
    };

    return (
        <div className="container mx-auto p-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Histórico de Vendas
            </h1>

            {/* --- 3. SEÇÃO DE FILTROS ADICIONADA --- */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex flex-wrap items-end gap-4">
                <div className="flex-grow">
                    <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">De:</label>
                    <input
                        type="date"
                        id="dataInicio"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div className="flex-grow">
                    <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Até:</label>
                    <input
                        type="date"
                        id="dataFim"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <button
                    onClick={limparFiltros}
                    className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors"
                >
                    Limpar Filtro
                </button>
            </div>
            {/* --- FIM DA SEÇÃO DE FILTROS --- */}

            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
                <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        {/* ... cabeçalho da tabela ... */}
                        <tr>
                            <th scope="col" className="px-6 py-3">ID da Venda</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3 text-center">Itens</th>
                            <th scope="col" className="px-6 py-3 text-right">Valor Total</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 4. A tabela agora mapeia as 'vendasFiltradas' */}
                        {vendasFiltradas.length > 0 ? (
                            vendasFiltradas.map((venda) => (
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
                                    Nenhuma venda encontrada para o período selecionado.
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


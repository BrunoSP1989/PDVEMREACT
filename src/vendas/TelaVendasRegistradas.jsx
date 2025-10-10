import React, { useState, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import RelatorioPDF from '../components/RelatorioPDF'; // Verifique o caminho

function TelaVendasRegistradas({ vendas }) {
    const hoje = new Date().toISOString().slice(0, 10);
    const [vendaExpandidaId, setVendaExpandidaId] = useState(null);
    const [dataInicio, setDataInicio] = useState(hoje);
    const [dataFim, setDataFim] = useState(hoje);
    const [filtroPagamento, setFiltroPagamento] = useState('');
    const [gerandoPDF, setGerandoPDF] = useState(false);

    const toggleDetalhes = (idVenda) => {
        setVendaExpandidaId(vendaExpandidaId === idVenda ? null : idVenda);
    };

    const formatarData = (dataISO) => {
        const data = new Date(dataISO);
        const offset = data.getTimezoneOffset();
        const dataAjustada = new Date(data.getTime() + (offset * 60 * 1000));
        return dataAjustada.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const formatarMoeda = (valor) => {
        if (typeof valor !== 'number') return 'R$ 0,00';
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatarDataParaNomeArquivo = (dataString) => {
        if (!dataString) return '';
        const partes = dataString.split('-');
        return `${partes[2]}${partes[1]}${partes[0]}`;
    };

    const limparFiltros = () => {
        setDataInicio('');
        setDataFim('');
        setFiltroPagamento('');
    };

    const formasDePagamentoUnicas = useMemo(() => {
        const metodos = new Set(vendas.map(v => v.formaPagamento).filter(Boolean));
        return ['Todas', ...metodos];
    }, [vendas]);

    const vendasFiltradas = useMemo(() => {
        return vendas.filter(venda => {
            const inicio = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;
            const fim = dataFim ? new Date(dataFim + 'T23:59:59') : null;
            const dataVenda = new Date(venda.data);

            if (inicio && dataVenda < inicio) return false;
            if (fim && dataVenda > fim) return false;
            if (filtroPagamento && filtroPagamento !== 'Todas' && venda.formaPagamento !== filtroPagamento) {
                return false;
            }
            return true;
        });
    }, [vendas, dataInicio, dataFim, filtroPagamento]);

    const handleGerarPDF = (e) => {
        e.preventDefault();
        if (vendasFiltradas.length === 0) {
            alert("Nenhuma venda encontrada para os filtros selecionados.");
            return;
        }
        setGerandoPDF(true);
        setTimeout(() => {
            const relatorioElement = document.getElementById('relatorio-para-pdf');
            if (!relatorioElement) {
                console.error("Elemento do relatório para PDF não foi encontrado!");
                setGerandoPDF(false);
                return;
            }

            const dataInicioFormatada = formatarDataParaNomeArquivo(dataInicio);
            const dataFimFormatada = formatarDataParaNomeArquivo(dataFim);

            let nomeBase = "relatorio_vendas";
            if (dataInicioFormatada) {
                nomeBase += `_de_${dataInicioFormatada}`;
            }
            if (dataFimFormatada) {
                nomeBase += `_ate_${dataFimFormatada}`;
            }
            const nomeDoArquivo = `${nomeBase}.pdf`;

            const opt = {
                margin: [1, 1, 1, 1],
                filename: nomeDoArquivo,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().from(relatorioElement).set(opt).save().then(() => {
                setGerandoPDF(false);
            });
        }, 100);
    };

    return (
        <div className="container mx-auto p-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">

            {gerandoPDF && (
                <RelatorioPDF
                    vendas={vendasFiltradas}
                    formatarData={formatarData}
                    formatarMoeda={formatarMoeda}
                />
            )}

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Histórico de Vendas</h1>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 flex flex-wrap items-end gap-4">
                <div className="flex-grow min-w-[150px]">
                    <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">De:</label>
                    <input type="date" id="dataInicio" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="flex-grow min-w-[150px]">
                    <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Até:</label>
                    <input type="date" id="dataFim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="flex-grow min-w-[180px]">
                    <label htmlFor="filtroPagamento" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Forma de Pagamento:</label>
                    <select id="filtroPagamento" value={filtroPagamento} onChange={(e) => setFiltroPagamento(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        {formasDePagamentoUnicas.map(metodo => (
                            <option key={metodo} value={metodo === 'Todas' ? '' : metodo}>{metodo}</option>
                        ))}
                    </select>
                </div>
                <button type="button" onClick={limparFiltros} className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors">Limpar Filtros</button>
                <button type="button" onClick={handleGerarPDF} className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">Salvar em PDF</button>
            </div>
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
                        {vendasFiltradas.length > 0 ? (
                            vendasFiltradas.map((venda) => (
                                <React.Fragment key={venda.id}>
                                    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">VENDA-{venda.id}</th>
                                        <td className="px-6 py-4">{formatarData(venda.data)}</td>
                                        <td className="px-6 py-4 text-center">{venda.itens.length}</td>
                                        <td className="px-6 py-4 text-right font-semibold">{formatarMoeda(venda.total)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button type="button" onClick={() => toggleDetalhes(venda.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">{vendaExpandidaId === venda.id ? 'Fechar' : 'Ver Detalhes'}</button>
                                        </td>
                                    </tr>
                                    {vendaExpandidaId === venda.id && (
                                        <tr className="bg-gray-50 dark:bg-gray-700">
                                            <td colSpan="5" className="p-4">
                                                <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-inner">
                                                    <div className="flex justify-between items-center mb-3 border-b border-gray-200 dark:border-gray-600 pb-2">
                                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Forma de Pagamento:</span>
                                                        <span className="px-2 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-md dark:bg-green-700 dark:text-green-100">{venda.formaPagamento || 'Não informada'}</span>
                                                    </div>
                                                    <h4 className="text-md font-bold text-gray-800 dark:text-white mb-3">Produtos Vendidos:</h4>
                                                    <ul className="space-y-2">
                                                        {venda.itens.map(item => (
                                                            <li key={item.id} className="flex justify-between items-center text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                                                                <span>{item.nome}</span>
                                                                <span className="text-right font-mono">{item.quantidade} x {formatarMoeda(item.preco)} = <strong>{formatarMoeda(item.quantidade * item.preco)}</strong></span>
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
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">Nenhuma venda encontrada para os filtros selecionados.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TelaVendasRegistradas;
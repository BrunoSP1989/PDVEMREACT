import React, { useState, useMemo } from 'react';
import ModalProdutos from '../components/ModalProdutos';
import ModalPagamento from '../components/ModalPagamento';
import ModalRecibo from '../components/ModalRecibo';

function TelaVenda({ produtos, onFinalizarVenda }) {
    const [carrinho, setCarrinho] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const [isModalAberto, setIsModalAberto] = useState(false);
    const [isModalPagamentoAberto, setIsModalPagamentoAberto] = useState(false);
    const [isModalReciboAberto, setIsModalReciboAberto] = useState(false);
    const [ultimaVenda, setUltimaVenda] = useState(null);

    const handleAdicionarAoCarrinho = (e) => {
        e.preventDefault();
        if (!produtoSelecionado) {
            alert('Por favor, selecione um produto.');
            return;
        }
        if (quantidade <= 0) {
            alert('A quantidade deve ser pelo menos 1.');
            return;
        }
        const itemExistente = carrinho.find(item => item.id === produtoSelecionado.id);
        const quantidadeNoCarrinho = itemExistente ? itemExistente.quantidade : 0;
        if ((quantidade + quantidadeNoCarrinho) > produtoSelecionado.estoque) {
            alert(`Quantidade total excede o estoque disponível de ${produtoSelecionado.estoque} unidades.`);
            return;
        }
        if (itemExistente) {
            setCarrinho(carrinho.map(item => item.id === produtoSelecionado.id ? { ...item, quantidade: item.quantidade + quantidade } : item));
        } else {
            setCarrinho([...carrinho, { ...produtoSelecionado, quantidade }]);
        }
        setProdutoSelecionado(null);
        setQuantidade(1);
    };

    const handleRemoverDoCarrinho = (produtoId) => {
        setCarrinho(carrinho.filter(item => item.id !== produtoId));
    };

    const handleSelecionarProdutoDoModal = (produto) => {
        if (produto.estoque > 0) {
            setProdutoSelecionado(produto);
            setIsModalAberto(false);
        } else {
            alert("Este produto está sem estoque e não pode ser selecionado.");
        }
    };

    const totalVenda = useMemo(() => {
        return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }, [carrinho]);

    const handleAbrirModalPagamento = () => {
        if (carrinho.length === 0) {
            alert("O carrinho está vazio.");
            return;
        }
        setIsModalPagamentoAberto(true);
    };

    const handleConfirmarPagamento = (formaDePagamento) => {
        // A única alteração está aqui: adicionamos o 'id' ao recibo.
        const reciboData = {
            id: Date.now(),
            itens: [...carrinho],
            total: totalVenda,
            formaPagamento: formaDePagamento,
            data: new Date(),
        };
        setUltimaVenda(reciboData);

        onFinalizarVenda(carrinho);

        setCarrinho([]);

        setIsModalPagamentoAberto(false);
        setIsModalReciboAberto(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Painel de Venda</h2>
                        <form onSubmit={handleAdicionarAoCarrinho} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Produto Selecionado</label>
                                <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-700 min-h-[60px] flex flex-col justify-center">
                                    {produtoSelecionado ? (
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-800 dark:text-white">{produtoSelecionado.nome}</span>
                                            <span className="font-bold text-lg text-blue-500">R$ {produtoSelecionado.preco.toFixed(2)}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">Nenhum produto selecionado</span>
                                    )}
                                </div>
                                <button type="button" onClick={() => setIsModalAberto(true)} className="w-full mt-2 py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors">
                                    Selecionar Produto
                                </button>
                            </div>
                            <div>
                                <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantidade</label>
                                <input id="quantidade" type="number" min="1" max={produtoSelecionado?.estoque || 1} value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} className="w-full px-4 py-2 border rounded-md" disabled={!produtoSelecionado} />
                            </div>
                            <button type="submit" className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors" disabled={!produtoSelecionado}>
                                Adicionar ao Carrinho
                            </button>
                        </form>
                    </div>
                </div>
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Resumo da Venda</h2>
                        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                            {carrinho.length === 0 ? (
                                <p className="text-center text-gray-500">O carrinho está vazio.</p>
                            ) : (
                                carrinho.map(item => (
                                    <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{item.nome}</p>
                                            <p className="text-sm text-gray-500">{item.quantidade} x R$ {item.preco.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <p className="font-semibold text-gray-900 dark:text-white">R$ {(item.quantidade * item.preco).toFixed(2)}</p>
                                            <button onClick={() => handleRemoverDoCarrinho(item.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs w-6 h-6 rounded-full">X</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center text-2xl font-bold">
                                <span className="text-gray-800 dark:text-white">TOTAL</span>
                                <span className="text-green-500">R$ {totalVenda.toFixed(2)}</span>
                            </div>
                            <button onClick={handleAbrirModalPagamento} className="mt-6 w-full py-3 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded-md transition-colors text-lg disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={carrinho.length === 0}>
                                Finalizar Venda
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalProdutos isOpen={isModalAberto} onClose={() => setIsModalAberto(false)} produtos={produtos} onProdutoSelect={handleSelecionarProdutoDoModal} />
            <ModalPagamento isOpen={isModalPagamentoAberto} onClose={() => setIsModalPagamentoAberto(false)} onConfirm={handleConfirmarPagamento} totalVenda={totalVenda} />
            <ModalRecibo isOpen={isModalReciboAberto} onClose={() => setIsModalReciboAberto(false)} recibo={ultimaVenda} />
        </>
    );
}

export default TelaVenda;
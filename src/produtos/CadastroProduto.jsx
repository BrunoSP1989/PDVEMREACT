import React, { useState, useEffect } from 'react';

// 1. Recebe a nova prop 'onCancelar'
function CadastroProduto({ onSalvar, categorias, produtoParaEditar, onCancelar }) {
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [estoque, setEstoque] = useState('');
    const [categoria, setCategoria] = useState(categorias[0]?.nome || '');
    const [precoCusto, setPrecoCusto] = useState('');

    useEffect(() => {
        if (produtoParaEditar) {
            setNome(produtoParaEditar.nome);
            setPreco(produtoParaEditar.preco);
            setEstoque(produtoParaEditar.estoque);
            setCategoria(produtoParaEditar.categoria);
            setPrecoCusto(produtoParaEditar.precoCusto);
        } else {
            setNome('');
            setPreco('');
            setPrecoCusto('');
            setEstoque('');
            setCategoria(categorias[0]?.nome || '');
        }
    }, [produtoParaEditar, categorias]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const produtoData = {
            nome,
            preco: parseFloat(preco),
            estoque: parseInt(estoque),
            precoCusto: parseFloat(precoCusto),
            categoria
        };
        onSalvar(produtoData);
    };

    const modoEdicao = !!produtoParaEditar;

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                {modoEdicao ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campos do formulário ... */}
                <div><label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Produto</label><input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-4 py-2 border rounded-md" /></div>
                <div><label htmlFor="preco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preço (R$)</label><input id="preco" type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required className="w-full px-4 py-2 border rounded-md" /></div>
                <div><label htmlFor="precoCusto" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preço de Custo (R$)</label><input id="precoCusto" type="number" step="0.01" value={precoCusto} onChange={(e) => setPrecoCusto(e.target.value)} required className="w-full px-4 py-2 border rounded-md" /></div>
                <div><label htmlFor="estoque" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantidade em Estoque</label><input id="estoque" type="number" value={estoque} onChange={(e) => setEstoque(e.target.value)} required className="w-full px-4 py-2 border rounded-md" /></div>
                <div><label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label><select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="w-full px-4 py-2 border rounded-md">{categorias.length === 0 ? (<option value="" disabled>Cadastre uma categoria</option>) : (categorias.map((cat) => (<option key={cat.id} value={cat.nome}>{cat.nome}</option>)))}</select></div>

                {/* 2. Container para os botões de ação */}
                <div className="flex space-x-4">
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">
                        {modoEdicao ? 'Salvar Alterações' : 'Adicionar Produto'}
                    </button>

                    {/* 3. Botão 'Cancelar' que só aparece no modo de edição */}
                    {modoEdicao && (
                        <button
                            type="button" // Importante: 'type="button"' para não submeter o formulário
                            onClick={onCancelar}
                            className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md transition-colors"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default CadastroProduto;
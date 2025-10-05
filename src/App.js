import { useState, useEffect } from 'react';

import ListaProdutos from './produtos/ListaProdutos';
import CadastroProduto from './produtos/CadastroProduto';
import CadastroCategoria from './produtos/CadastroCategoria';
import ListaCategorias from './produtos/ListaCategorias';
import TelaVenda from './vendas/TelaVenda.jsx';

const VALORES_INICIAIS_CATEGORIAS = [
  { id: 1, nome: 'Periféricos' }, { id: 2, nome: 'Monitores' }, { id: 3, nome: 'Hardware' },
];

function App() {
  const [view, setView] = useState('listarProdutos');
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Mouse Gamer', preco: 159.9, estoque: 30, categoria: 'Periféricos' },
    { id: 2, nome: 'Monitor Ultrawide', preco: 1899.9, estoque: 15, categoria: 'Monitores' },
    { id: 3, nome: 'Placa de Vídeo RTX', preco: 4500.0, estoque: 5, categoria: 'Hardware' },
  ]);
  const [categorias, setCategorias] = useState([]);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

  // Efeitos para limpar edição e sincronizar categorias
  useEffect(() => {
    if (view !== 'cadastrarProduto') setProdutoEmEdicao(null);
  }, [view]);
  useEffect(() => {
    const catSalvas = localStorage.getItem('categorias');
    setCategorias(catSalvas ? JSON.parse(catSalvas) : VALORES_INICIAIS_CATEGORIAS);
  }, []);
  useEffect(() => {
    if (categorias.length > 0) localStorage.setItem('categorias', JSON.stringify(categorias));
  }, [categorias]);

  // Lógica de Categorias
  const adicionarCategoriaNaLista = (novaCategoria) => setCategorias([...categorias, novaCategoria]);
  const removerCategoriaDaLista = (id) => setCategorias(categorias.filter(c => c.id !== id));

  // ==========================================================
  // LÓGICA DE PRODUTOS - FUNÇÕES PREENCHIDAS
  // ==========================================================
  const salvarProduto = (produtoData) => {
    if (produtoEmEdicao) {
      // Atualiza o produto existente
      setProdutos(produtos.map(p =>
        p.id === produtoEmEdicao.id ? { ...produtoData, id: produtoEmEdicao.id } : p
      ));
    } else {
      // Adiciona um novo produto com ID
      setProdutos([...produtos, { ...produtoData, id: Date.now() }]);
    }
    setView('listarProdutos');
  };

  const deletarProduto = (id) => {
    if (window.confirm("Tem certeza que deseja deletar este produto?")) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  };

  const editarProduto = (produto) => {
    setProdutoEmEdicao(produto);
    setView('cadastrarProduto');
  };

  const cancelarEdicao = () => {
    setProdutoEmEdicao(null);
    setView('listarProdutos');
  };

  // Lógica de Vendas
  const handleFinalizarVenda = (carrinho) => {
    let produtosAtualizados = [...produtos];
    carrinho.forEach(itemVendido => {
      const indexProduto = produtosAtualizados.findIndex(p => p.id === itemVendido.id);
      if (indexProduto !== -1) {
        produtosAtualizados[indexProduto].estoque -= itemVendido.quantidade;
      }
    });
    setProdutos(produtosAtualizados);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full flex flex-col items-center p-4 space-y-8">
      <nav className="flex flex-wrap justify-center gap-2 md:space-x-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
        <button onClick={() => setView('vendas')} className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 text-sm md:text-base ${view === 'vendas' ? 'bg-green-500 text-white' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700'}`}>
          Realizar Venda
        </button>
        <button onClick={() => setView('listarProdutos')} className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 text-sm md:text-base ${view === 'listarProdutos' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'}`}>
          Listar Produtos
        </button>
        <button onClick={() => setView('cadastrarProduto')} className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 text-sm md:text-base ${view === 'cadastrarProduto' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'}`}>
          Cadastrar Produto
        </button>
        <button onClick={() => setView('cadastrarCategoria')} className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 text-sm md:text-base ${view === 'cadastrarCategoria' ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'}`}>
          Cadastrar Categoria
        </button>
      </nav>

      <main className="w-full max-w-7xl">
        {view === 'vendas' && <TelaVenda produtos={produtos} onFinalizarVenda={handleFinalizarVenda} />}
        {view === 'listarProdutos' && <ListaProdutos produtos={produtos} onEditar={editarProduto} onDeletar={deletarProduto} />}
        {view === 'cadastrarProduto' && <CadastroProduto onSalvar={salvarProduto} categorias={categorias} produtoParaEditar={produtoEmEdicao} onCancelar={cancelarEdicao} />}
        {view === 'cadastrarCategoria' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CadastroCategoria onCategoriaAdicionada={adicionarCategoriaNaLista} />
            <ListaCategorias categorias={categorias} onRemoverCategoria={removerCategoriaDaLista} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
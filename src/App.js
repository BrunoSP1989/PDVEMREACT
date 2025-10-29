import { useState, useEffect } from 'react';

// COMPONENTES DE PRODUTOS E CATEGORIAS
import ListaProdutos from './produtos/ListaProdutos';
import CadastroProduto from './produtos/CadastroProduto';
import CadastroCategoria from './produtos/CadastroCategoria';
import ListaCategorias from './produtos/ListaCategorias';
import CadastroCliente from './clientes/CadastroCliente';

// COMPONENTES DE VENDAS
import TelaVenda from './vendas/TelaVenda.jsx';
// --- 1. IMPORTAR O NOVO COMPONENTE ---
import TelaVendasRegistradas from './vendas/TelaVendasRegistradas.jsx';


const VALORES_INICIAIS_CATEGORIAS = [
  { id: 1, nome: 'Periféricos' }, { id: 2, nome: 'Monitores' }, { id: 3, nome: 'Hardware' },
];

function App() {
  // O estado inicial da view agora é 'vendas' para uma melhor experiência inicial
  const [view, setView] = useState('vendas');
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Mouse Gamer', preco: 159.9, precoCusto: 120, estoque: 30, categoria: 'Periféricos' },
    { id: 2, nome: 'Monitor Ultrawide', preco: 1899.9, precoCusto: 120, estoque: 15, categoria: 'Monitores' },
    { id: 3, nome: 'Placa de Vídeo RTX', preco: 4500.0, precoCusto: 120, estoque: 5, categoria: 'Hardware' },
  ]);
  const [categorias, setCategorias] = useState([]);
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

  // --- 2. ADICIONAR ESTADO PARA O HISTÓRICO DE VENDAS ---
  const [historicoVendas, setHistoricoVendas] = useState([]);

  const [clientes, setClientes] = useState([
    // Cliente inicial de exemplo
    { id: 1, nome: 'João da Silva', email: 'joao@example.com', telefone: '11987654321', endereco: 'Rua Principal, 10' }
  ])
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null);


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

  // Lógica de Produtos
  const salvarProduto = (produtoData) => {
    if (produtoEmEdicao) {
      setProdutos(produtos.map(p =>
        p.id === produtoEmEdicao.id ? { ...produtoData, id: produtoEmEdicao.id } : p
      ));
    } else {
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
  const salvarCliente = (clienteData) => {
    if (clienteEmEdicao) {
      // Modo Edição: Mapeia e atualiza o cliente correto
      setClientes(clientes.map(c =>
        c.id === clienteEmEdicao.id ? { ...clienteData, id: clienteEmEdicao.id } : c
      ));
    } else {
      // Modo Cadastro: Adiciona um novo cliente com um ID
      setClientes([...clientes, { ...clienteData, id: Date.now() }]);
    }
    // Após salvar, volta para uma view de listagem ou principal
    setView('vendas'); // Ou 'listarClientes' se você criar uma lista
    setClienteEmEdicao(null); // Limpa o estado de edição
  };

  const cancelarEdicaoCliente = () => {
    setClienteEmEdicao(null);
    setView('vendas'); // Volta para a tela principal
  };

  // --- CORREÇÃO APLICADA AQUI ---
  const handleFinalizarVenda = (dadosVenda) => {
    let vendaCompleta;

    // Verifica se a TelaVenda enviou o objeto completo ou apenas o carrinho.
    // Isso torna a função mais robusta e corrige o erro 'toLocaleString'.
    if (Array.isArray(dadosVenda)) {
      // Se for apenas o carrinho, criamos um objeto de venda mais estruturado.
      console.warn("Recebendo dados de venda incompletos. Criando um objeto de venda padronizado.");
      vendaCompleta = {
        id: Date.now(),
        itens: dadosVenda,
        total: dadosVenda.reduce((acc, item) => acc + item.preco * item.quantidade, 0),
        data: new Date().toISOString()
      };
    } else {
      // Se já for o objeto completo, apenas o usamos.
      vendaCompleta = dadosVenda;
    }

    // Adiciona o objeto de venda, agora completo e padronizado, ao histórico.
    setHistoricoVendas(prevHistorico => [vendaCompleta, ...prevHistorico]);

    const itensVendidos = vendaCompleta.itens;

    // Se, por algum motivo, os itens não puderem ser encontrados, interrompemos.
    if (!itensVendidos) {
      console.error("Não foi possível processar a venda. Itens não encontrados:", vendaCompleta);
      return;
    }

    // Lógica para atualizar o estoque
    let produtosAtualizados = [...produtos];
    itensVendidos.forEach(itemVendido => {
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
        {/* --- 4. ADICIONAR NOVO BOTÃO DE NAVEGAÇÃO --- */}
        <button onClick={() => setView('historicoVendas')} className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 text-sm md:text-base ${view === 'historicoVendas' ? 'bg-green-500 text-white' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-gray-700'}`}>
          Histórico de Vendas
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
        {/* ✨ NOVO: Botão de Cadastro de Cliente */}
        <button onClick={() => setView('cadastrarCliente')} className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 text-sm md:text-base ${view === 'cadastrarCliente' ? 'bg-purple-500 text-white' : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'}`}>
          Cadastrar Cliente
        </button>
      </nav>

      <main className="w-full max-w-7xl">
        {view === 'vendas' && <TelaVenda produtos={produtos} onFinalizarVenda={handleFinalizarVenda} />}
        {/* --- 5. ADICIONAR RENDERIZAÇÃO CONDICIONAL PARA A NOVA TELA --- */}
        {view === 'historicoVendas' && <TelaVendasRegistradas vendas={historicoVendas} />}

        {view === 'listarProdutos' && <ListaProdutos produtos={produtos} onEditar={editarProduto} onDeletar={deletarProduto} />}
        {view === 'cadastrarProduto' && <CadastroProduto onSalvar={salvarProduto} categorias={categorias} produtoParaEditar={produtoEmEdicao} onCancelar={cancelarEdicao} />}
        {view === 'cadastrarCategoria' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CadastroCategoria onCategoriaAdicionada={adicionarCategoriaNaLista} />
            <ListaCategorias categorias={categorias} onRemoverCategoria={removerCategoriaDaLista} />
          </div>
        )}
        {view === 'cadastrarCliente' && (
          <CadastroCliente
            onSalvar={salvarCliente}
            clienteParaEditar={clienteEmEdicao}
            onCancelar={cancelarEdicaoCliente}
          />
        )}
      </main>
    </div>
  );
}

export default App;


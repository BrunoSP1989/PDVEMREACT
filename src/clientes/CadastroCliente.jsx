import React, { useState, useEffect } from 'react';

function CadastroCliente({ onSalvar, clienteParaEditar, onCancelar }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [endereco, setEndereco] = useState('');
    useEffect(() => {
        if (clienteParaEditar) {
            setNome(clienteParaEditar.nome || '');
            setEmail(clienteParaEditar.email || '');
            setTelefone(clienteParaEditar.telefone || '');
            setEndereco(clienteParaEditar.endereco || '');
        } else {
            // Limpa os campos quando não há cliente para editar
            setNome('');
            setEmail('');
            setTelefone('');
            setEndereco('');
        }
    }, [clienteParaEditar]);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Objeto de dados do cliente
        const clienteData = {
            nome,
            email,
            telefone,
            endereco
            // Não precisamos de parseFloat ou parseInt, pois são todos strings de texto
        };
        onSalvar(clienteData);
    };

    // Variável para verificar o modo de edição
    const modoEdicao = !!clienteParaEditar;
    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                {modoEdicao ? 'Editar Cliente' : 'Cadastrar Novo Cliente'} {/* Título atualizado */}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Nome */}
                <div><label htmlFor="nome" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome Completo</label><input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full px-4 py-2 border rounded-md" /></div>

                {/* Campo Email */}
                <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md" /></div>

                {/* Campo Telefone */}
                <div><label htmlFor="telefone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone</label><input id="telefone" type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} required className="w-full px-4 py-2 border rounded-md" /></div>

                {/* Campo Endereço (usamos um <textarea> para um campo maior) */}
                <div><label htmlFor="endereco" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Endereço</label><textarea id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} required className="w-full px-4 py-2 border rounded-md" rows="3" /></div>

                {/* Área de Botões (Mantemos a mesma lógica e aparência) */}
                <div className="flex space-x-4">
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">
                        {modoEdicao ? 'Salvar Alterações' : 'Adicionar Cliente'} {/* Texto do botão atualizado */}
                    </button>

                    {/* Botão 'Cancelar' - Aparece apenas no modo de edição */}
                    {modoEdicao && (
                        <button
                            type="button"
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

export default CadastroCliente;
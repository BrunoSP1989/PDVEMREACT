import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

function ModalRecibo({ isOpen, onClose, recibo }) {
    const reciboRef = useRef(null);

    if (!isOpen || !recibo) return null;

    const handleSalvarPDF = () => {
        const elemento = reciboRef.current;

        const opt = {
            margin: 1,
            filename: `recibo-venda-${recibo.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(elemento).set(opt).save();
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 font-mono"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white text-black rounded-lg shadow-2xl w-full max-w-sm flex flex-col"
            >
                <div ref={reciboRef} className="p-6">
                    <div className="border-b border-dashed border-black pb-4">
                        <h2 className="text-xl font-bold text-center">PDV System</h2>
                        <p className="text-center text-sm">CUPOM NÃO FISCAL</p>
                        <p className="text-center text-xs mt-2">
                            {recibo.data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' })}
                        </p>
                    </div>

                    <div className="py-4 border-b border-dashed border-black">
                        <div className="flex justify-between font-bold text-sm mb-2">
                            <span>QTD. PRODUTO</span>
                            <span>SUBTOTAL</span>
                        </div>
                        <div className="space-y-2">
                            {recibo.itens.map(item => (
                                <div key={item.id} className="flex justify-between items-start text-sm">
                                    <div className="flex-1 pr-2">
                                        <span>{item.quantidade}x {item.nome}</span><br />
                                        <span className="text-xs">(R$ {item.preco.toFixed(2)} / un.)</span>
                                    </div>
                                    <span className="font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="py-4 space-y-2">
                        <div className="flex justify-between items-center font-bold">
                            <span>TOTAL</span>
                            <span className="text-2xl">R$ {recibo.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Forma de Pagamento</span>
                            <span className="font-semibold">{recibo.formaPagamento}</span>
                        </div>
                    </div>
                    <p className="text-center text-sm font-semibold pt-4">Obrigado pela preferência!</p>
                </div>

                <div className="p-4 border-t bg-gray-50 flex justify-end space-x-4">
                    <button
                        onClick={handleSalvarPDF}
                        className="py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-md transition-colors"
                    >
                        Salvar em PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-md"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalRecibo;
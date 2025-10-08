import React from 'react';

// O componente recebe as props necessárias para gerar o relatório
function RelatorioPDF({ vendas, formatarData, formatarMoeda }) {
    // Estilos inline para simplicidade e para garantir que apareçam no PDF
    const styles = {
        page: { padding: '2cm', fontFamily: 'Arial, sans-serif', color: '#333' },
        header: { textAlign: 'center', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px' },
        h1: { margin: 0, fontSize: '24px' },
        vendaContainer: { border: '1px solid #eee', borderRadius: '5px', padding: '15px', marginBottom: '15px', pageBreakInside: 'avoid' }, // Evita quebra de página dentro de uma venda
        vendaHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee', flexWrap: 'wrap' },
        vendaInfo: { fontSize: '14px', minWidth: '150px', marginBottom: '5px' },
        itensTable: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
        th: { background: '#f4f4f4', padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' },
        td: { padding: '8px', borderBottom: '1px solid #ddd' },
    };

    return (
        // Esta é a div que o torna invisível para o usuário na tela principal
        <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
            {/* Este é o container que será efetivamente capturado pelo html2pdf */}
            <div id="relatorio-para-pdf" style={styles.page}>
                <div style={styles.header}>
                    <h1 style={styles.h1}>Relatório de Vendas</h1>
                </div>

                {vendas.map(venda => (
                    <div key={venda.id} style={styles.vendaContainer}>
                        <div style={styles.vendaHeader}>
                            <div style={styles.vendaInfo}><strong>ID VENDA:</strong> {venda.id}</div>
                            <div style={styles.vendaInfo}><strong>DATA:</strong> {formatarData(venda.data)}</div>
                            <div style={styles.vendaInfo}><strong>PAGAMENTO:</strong> {venda.formaPagamento}</div>
                            <div style={styles.vendaInfo}><strong>TOTAL:</strong> {formatarMoeda(venda.total)}</div>
                        </div>
                        
                        <h4 style={{ marginTop: '15px', marginBottom: '10px', fontSize: '14px' }}>Itens Vendidos:</h4>
                        <table style={styles.itensTable}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Produto</th>
                                    <th style={styles.th}>Qtd.</th>
                                    <th style={styles.th}>Preço Unit.</th>
                                    <th style={styles.th}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {venda.itens.map(item => (
                                    <tr key={item.id}>
                                        <td style={styles.td}>{item.nome}</td>
                                        <td style={styles.td}>{item.quantidade}</td>
                                        <td style={styles.td}>{formatarMoeda(item.preco)}</td>
                                        <td style={styles.td}>{formatarMoeda(item.quantidade * item.preco)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ✅ ESSENCIAL: Exporta o componente para que outros arquivos possam importá-lo.
export default RelatorioPDF;
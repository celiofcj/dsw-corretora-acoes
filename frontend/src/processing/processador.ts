import emitter, {type HoraOperacao, type HoraOperacaoAtualizacao} from './eventBus';

console.log('DataProcessor Singleton: Inicializado e pronto para escutar eventos.');

const url = 'http://localhost:3000'

const PRECO_URL_BASE = 'https://raw.githubusercontent.com/marciobarros/dsw-simulador-corretora/refs/heads/main/';


interface IOrdemVenda  {
    dataHora: Date;
    ticker: string;
    quantidade: number;
    executada: boolean;
    precoExecucao?: number;
    precoReferenciaVenda: number;
    id: string
}

export interface IOrdemCompra {
    ticker : string;
    quantidade : number;
    executada: boolean;
    dataHora : Date;
    precoReferenciaCompra: number;
    dataHoraExecucao?: Date;
    precoExecucao?: number;
    id: string
}

async function executarOrdemVenda(ordem: IOrdemVenda, preco: number, dataHora: string) {
    console.log(dataHora)
    const token = localStorage.getItem('authToken');

    return fetch(`${url}/ordemVenda/${ordem.id}/executar`,{
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dataHora: dataHora,
            preco: preco
        })
    })
        .then(response => {
            if(response.ok) {
                console.log(`Ordem de venda ${ordem.id} executada com sucesso`)
                return response.json()
            }

            throw new Error('Erro ao executar ordem de venda')
        })
        .catch(() => {
            console.log(`Erro ao executar ordem de venda ${ordem.id}`)
        })
}

async function executarOrdemCompra(ordem: IOrdemCompra, preco: number, dataHora: string) {
    const token = localStorage.getItem('authToken');

    return fetch(`${url}/ordemCompra/${ordem.id}/executar`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dataHora: dataHora,
            preco: preco
        })
    })
        .then(response => {
            if (response.ok) {
                console.log(`Ordem de compra ${ordem.id} executada com sucesso`);
                return response.json();
            }
            throw new Error('Erro ao executar ordem de compra');
        })
        .catch(() => {
            console.log(`Erro ao executar ordem de compra ${ordem.id}`);
        });
}


async function processarCarteira(tickers: any, dataHora: string) {
    console.log('Iniciando processamento carteira');
    const token = localStorage.getItem('authToken');

    const tickersMap = await tickers;
    if (!tickersMap) {
        console.error('Não foi possível obter o mapa de tickers.');
        return;
    }

    const ordensVenda = await fetch(url + '/ordemVenda', {
        headers:{
            Authorization: 'Bearer ' + token,
        }
    }).then(response => {
        if(!response.ok) {
            console.error('Não foi possível processar carteira');
            return [];
        }
        console.log('Processando carteira');
        return response.json();
    })
        .then(json => {
            return json as IOrdemVenda[];
        })
        .catch(error => {
            console.error('Erro ao buscar ordens de venda:', error);
            return [];
        });

    const promises = ordensVenda
        .filter(ordemVenda => !ordemVenda.executada)
        .map(ordem => {
            const precoAtual = tickersMap.get(ordem.ticker);
            if (precoAtual !== undefined && precoAtual >= ordem.precoReferenciaVenda) {
                console.log(`Condição de venda para ${ordem.ticker} atingida. Preço de referência: ${ordem.precoReferenciaVenda}, Preço atual: ${precoAtual}.`);

                return executarOrdemVenda(ordem, precoAtual, dataHora)
            }
        });

    return Promise.all(promises)
}

async function processarMercado(tickers: any, dataHora: string) {
    console.log('Iniciando processamento mercado');
    const token = localStorage.getItem('authToken');

    const tickersMap = await tickers;
    if (!tickersMap) {
        console.error('Não foi possível obter o mapa de tickers.');
        return;
    }

    const ordensCompra = await fetch(url + '/ordemCompra', {
        headers:{
            Authorization: 'Bearer ' + token,
        }
    }).then(response => {
        if(!response.ok) {
            console.error('Não foi possível processar mercado');
            return [];
        }
        console.log('Processando mercado');
        return response.json();
    })
        .then(json => json as IOrdemCompra[])
        .catch(error => {
            console.error('Erro ao buscar ordens de compra:', error);
            return [];
        });

    const promises = ordensCompra
        .filter(ordem => !ordem.executada)
        .map(ordem => {
            const precoAtual = tickersMap.get(ordem.ticker);
            if(precoAtual !== undefined && precoAtual <= ordem.precoReferenciaCompra) {
                console.log(`Condição de compra para ${ordem.ticker} atingida. Preço de referência: ${ordem.precoReferenciaCompra}, Preço atual: ${precoAtual}.`);
                return executarOrdemCompra(ordem, precoAtual, dataHora);
            }
        });

    return Promise.all(promises);
}

async function obtemTickers(minuto: number) {
    try {
        const response = await fetch(`${PRECO_URL_BASE}${minuto}.json`);
        const precos: { ticker: string, preco: number }[] = await response.json();
        return new Map(precos.map(p => [p.ticker, p.preco]));
    } catch (error) {
        console.error('Erro ao buscar preços atuais:', error);
    }
}

function getHoraOperacao(horaOperacao: HoraOperacao) {
    const agora = new Date()
    const dataServidor = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate(),
        horaOperacao.hora,
        horaOperacao.minuto
    )
    dataServidor.setHours(dataServidor.getHours())
    return  dataServidor.toISOString()
}

emitter.on('time-process:start', async (horaOperacao: HoraOperacaoAtualizacao) => {
    console.log(`[DataProcessor] Evento 'time-process:start' recebido com: ${horaOperacao}`);

    for(let i = horaOperacao.minutoAnterior; i <= horaOperacao.minuto; i++) {
        console.log(`[DataProcessor] Processando minuto ${i}`)

        const tickers = obtemTickers(i)

        console.log(await tickers)

        const dataHora = getHoraOperacao(horaOperacao)

        await processarCarteira(tickers, dataHora);
        await processarMercado(tickers, dataHora);

        console.log(`[DataProcessor] Processamento concluído. Emitindo 'process:complete'.`);

        emitter.emit('time-process:complete', horaOperacao);
    }
});
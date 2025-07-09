import emitter, {type HoraOperacao} from './eventBus';

console.log('DataProcessor Singleton: Inicializado e pronto para escutar eventos.');

function processarCarteira(minutos: number) {

}

function processarMercado(minutos: number) {

}

emitter.on('time-process:start', (horaOperacao: HoraOperacao) => {
    console.log('Recebido')
    console.log(`[DataProcessor] Evento 'time-process:start' recebido com: ${horaOperacao}`);

    processarCarteira(horaOperacao.minuto);
    processarMercado(horaOperacao.minuto);

    console.log(`[DataProcessor] Processamento concluído. Emitindo 'process:complete'.`);

    emitter.emit('time-process:complete', horaOperacao);
});

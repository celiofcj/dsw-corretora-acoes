import emitter from './eventBus';

console.log('DataProcessor Singleton: Inicializado e pronto para escutar eventos.');

function processarCarteira(minutos: number) {

}

function processarMercado(minutos: number) {

}

emitter.on('time-process:start', (horaOperacao) => {
    console.log('Recebido')
    console.log(`[DataProcessor] Evento 'time-process:start' recebido com: ${horaOperacao}`);

    processarCarteira(horaOperacao.contadorMinutos);
    processarMercado(horaOperacao.contadorMinutos);

    console.log(`[DataProcessor] Processamento concluído. Emitindo 'process:complete'.`);

    emitter.emit('time-process:complete', horaOperacao);
});

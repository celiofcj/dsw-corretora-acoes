import emitter from './eventBus';

console.log('DataProcessor Singleton: Inicializado e pronto para escutar eventos.');

function processarCarteira(minutos: number) {

}

function processarMercado(minutos: number) {

}

emitter.on('time-process:start', (minutos) => {
    console.log(`[DataProcessor] Evento 'time-process:start' recebido com: "${minutos}"`);

    processarCarteira(minutos);
    processarMercado(minutos);

    console.log(`[DataProcessor] Processamento concluído. Emitindo 'process:complete'.`);

    emitter.emit('time-process:complete', null);
});

export const a = 1;

import mitt from 'mitt';

export interface HoraOperacao {
    hora: number
    minuto: number
}

export interface HoraOperacaoAtualizacao {
    hora: number
    minuto: number
    minutoAnterior: number
}

type Events = {
    'time-process:start': HoraOperacaoAtualizacao;

    'time-process:complete': HoraOperacao;

    'time-now:request': void;

    'time-now:response': HoraOperacao
};

const emitter = mitt<Events>();

export default emitter;
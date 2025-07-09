import mitt from 'mitt';

export interface HoraOperacao {
    hora: number
    minuto: number
}

type Events = {
    'time-process:start': HoraOperacao;

    'time-process:complete': HoraOperacao;

    'time-now:request': void;

    'time-now:response': HoraOperacao
};

const emitter = mitt<Events>();

export default emitter;
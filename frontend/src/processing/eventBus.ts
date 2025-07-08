import mitt from 'mitt';

interface HoraOperacao {
    hora: number
    minuto: number
    contadorMinutos: number
}

type Events = {
    'time-process:start': HoraOperacao;

    'time-process:complete': HoraOperacao;
};

const emitter = mitt<Events>();

export default emitter;
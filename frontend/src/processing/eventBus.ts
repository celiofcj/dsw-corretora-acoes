import mitt from 'mitt';

type Events = {
    'time-process:start': number;

    'time-process:complete': null;
};

const emitter = mitt<Events>();

export default emitter;
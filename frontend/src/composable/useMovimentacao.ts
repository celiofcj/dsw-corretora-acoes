import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { IContaCorrente, IMovimentacao } from '@/types/movimentacaoTypes';

export function useMovimentacao() {
    const router = useRouter();

    const contaCorrente = ref<IContaCorrente | null>(null);
    const movimentacoes = ref<IMovimentacao[]>([]);
    const erro = ref<string | null>(null);
    const isSubmitting = ref(false);

    const url = 'http://localhost:3000/movimentacao';
    const token = localStorage.getItem('authToken');

    const getContaCorrente = async () => {
        try {
            const response = await fetch(`${url}/contaCorrente`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            if (!response.ok) {
                throw new Error('Erro ao carregar o saldo da conta.');
            }
            contaCorrente.value = await response.json();
        } catch (e) {
            erro.value = 'Erro ao carregar o saldo da conta.';
            console.error(e);
        }
    };

    const getMovimentacoes = async () => {
        try {
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            if (!response.ok) {
                throw new Error('Erro ao carregar as movimentações.');
            }
            movimentacoes.value = await response.json();
        } catch (e) {
            console.error(e);
        }
    };

    const registrarMovimentacao = async (payload: { descricao: string; valor: number; tipo: 'DEPOSITO' | 'RETIRADA'}, hora: number, minuto: number) => {
        isSubmitting.value = true;

        const agora = new Date()
        const dataServidor = new Date(
            agora.getFullYear(),
            agora.getMonth(),
            agora.getDate(),
            hora,
            minuto
        )
        dataServidor.setHours(dataServidor.getHours())
        const dataHoraSimulada = dataServidor.toISOString()

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...payload,
                    dataHora: dataHoraSimulada,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ocorreu um erro ao processar a transação.');
            }


        } finally {
            isSubmitting.value = false;
        }
    };

    return {
        contaCorrente,
        movimentacoes,
        erro,
        isSubmitting,
        getContaCorrente,
        getMovimentacoes,
        registrarMovimentacao,
    };
}
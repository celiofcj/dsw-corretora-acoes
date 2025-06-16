import {IAcaoInteresse} from "../interface/acao-interesse";
import {AcaoInteresseDao} from "../dao/acao-interesse.dao";

export class AcaoInteresseService {
    private acaoInteresseDao = new AcaoInteresseDao()

    async salvarAcaoInteresse(acaoInteresse: IAcaoInteresse): Promise<IAcaoInteresse> {
        return this.acaoInteresseDao.salvarAcaoInteresse(acaoInteresse)
    }

    async obtemAcoesInteresse() {
        return this.acaoInteresseDao.obterTodas();
    }

    async removerAcaoInteresse(id: string) {
        return this.acaoInteresseDao.delete(id);
    }

    async subirAcaoInteresse(id: string) {
        const acaoInteresse = await this.acaoInteresseDao.obterUma(id)
            .then((resultado) => {
                    if (resultado === null) {
                        throw new Error(`Não existe ação de interesse com o id:${id} especificado`);
                    }

                    if (resultado.ordem == 0) {
                        throw new Error(`A ação com id:${id} já na ordem mínima`)
                    }
                    return resultado
                }
            )

        const ordemParaTrocar = acaoInteresse.ordem - 1;
        return this.trocarOrdem(acaoInteresse, ordemParaTrocar);
    }

    async descerAcaoInteresse(id: string) {
        const acaoInteresse = await this.acaoInteresseDao.obterUma(id)
            .then((resultado) => {
                    if (resultado === null) {
                        throw new Error(`Não existe ação de interesse com o id:${id} especificado`);
                    }
                    return resultado
                }
            )

        const ordemParaTrocar = acaoInteresse.ordem + 1;
        return this.trocarOrdem(acaoInteresse, ordemParaTrocar);
    }

    async trocarOrdem(acaoInteresse: IAcaoInteresse, target: number) {
        if(target < 0) {
            throw new Error(`Ordem não pode ser negativa!`);
        }

        const ordemOriginal = acaoInteresse.ordem;

        if(ordemOriginal === target) {
            throw new Error(`Ordem não pode ser igual à original!`);
        }

        const acaoParaTrocar = await this.acaoInteresseDao.obterDaOrdem(target)
            .then((resultado) => {
                if(resultado.length === 0) {
                    throw new Error(`Não existe ação com a ordem:${target}. Operação para o id:${acaoInteresse.id}`);
                }

                if(resultado.length > 1) {
                    throw new Error(`A busca pela ação de interesse de ordem:${target} retornou mais de um resultado. Operação para o id:${acaoInteresse.id}`);
                }

                return resultado[0];
            });

        acaoParaTrocar.ordem = -1;
        return this.acaoInteresseDao.salvarAcaoInteresse(acaoParaTrocar)
            .then(() => {
                acaoInteresse.ordem = target;
                return this.acaoInteresseDao.salvarAcaoInteresse(acaoInteresse)
            })
            .then((acaoAtualizada) => {
                acaoParaTrocar.ordem = ordemOriginal;
                this.acaoInteresseDao.salvarAcaoInteresse(acaoParaTrocar);
                return acaoAtualizada
            })
    }
}
import {IAcaoInteresse} from "../interface/acao-interesse";
import {AcaoInteresseDao} from "../dao/acao-interesse.dao";

export class AcaoInteresseService {
    private acaoInteresseDao = new AcaoInteresseDao()

    async salvarAcaoInteresse(acaoInteresse: IAcaoInteresse): Promise<IAcaoInteresse> {
        return this.acaoInteresseDao.salvarAcaoInteresse(acaoInteresse)
    }
}
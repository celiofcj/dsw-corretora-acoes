import AcaoInteresse, {IAcaoInteresse} from "../interface/acao-interesse";

export class AcaoInteresseDao {
    public async salvarAcaoInteresse(dados: IAcaoInteresse): Promise<IAcaoInteresse> {
        const acaoInteresse = new AcaoInteresse(dados)
        return await acaoInteresse.save()
    }
}
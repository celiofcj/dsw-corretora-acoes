import AcaoInteresse, {IAcaoInteresse} from "../interface/acao-interesse";

export class AcaoInteresseDao {
    async salvarAcaoInteresse(dados: IAcaoInteresse): Promise<IAcaoInteresse> {
        const acaoInteresse = new AcaoInteresse(dados)
        return acaoInteresse.save()
    }

    async salvarVarios(dados: Array<IAcaoInteresse>) : Promise<Array<IAcaoInteresse>> {
        return AcaoInteresse.insertMany(dados);
    }

    async obterTodas() : Promise<Array<IAcaoInteresse>> {
        return  AcaoInteresse.find()
    }

    async obterUma(id: string) : Promise<IAcaoInteresse | null> {
        return AcaoInteresse.findById(id);
    }

    async obterDaOrdem(numero: number): Promise<Array<IAcaoInteresse>> {
        return AcaoInteresse.find({ordem: numero})
    }

    async delete(id: string): Promise<IAcaoInteresse | null> {
        return AcaoInteresse.findByIdAndDelete(id)
    }
}
import Carteira, {ICarteira} from "../../carteira/interface/carteira";

export class CarteiraDao {
    async obterTodas() : Promise<Array<ICarteira>> {
        return  Carteira.find()
    }

}
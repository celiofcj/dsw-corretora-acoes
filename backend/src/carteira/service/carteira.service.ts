import {CarteiraDao} from "../dao/carteira.dao";

export class CarteiraService {
    private CarteiraDao = new CarteiraDao() ;

    async obtemCarteiras() {
        return this.CarteiraDao.obterTodas();
    }
}
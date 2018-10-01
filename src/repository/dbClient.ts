import {Pool, Client} from 'pg';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/defer';

const connectionPool = new Pool();

export default () => {
    return <Observable<Client>>Observable.defer(() => connectionPool.connect());
};

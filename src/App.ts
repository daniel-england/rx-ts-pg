import * as express from 'express';
import {findAllUsers} from './repository/userRepository';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/map';

const writeToRes = res => {
    const subject = new Subject();

    subject.skip(1).subscribe(() => res.write(','));

    subject.startWith('[')
        .finally(() => {
            res.write(']');
            res.end();
        })
        .subscribe(x => res.write(x));

    return subject;
};

class App {
    public express;

    constructor () {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes (): void {
        const router = express.Router();
        router.get('/users', (req, res) => {
            findAllUsers.map(user => JSON.stringify(user)).subscribe(writeToRes(res));
        });
        this.express.use('/', router)
    }
}

export default new App().express

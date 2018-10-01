import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/do';
import pg from 'pg';
import Cursor = require('pg-cursor');
import dbClient from './dbClient';

const toUser = row => {
    return <User>{id: row.id, name: row.name, department: row.department};
};

const query = (query: string) => {
    return <Observable<User>>dbClient()
        .mergeMap(client => {
            const cursor = client.query(new Cursor(query));

            const observableCursor = Observable.bindNodeCallback(cursor.read.bind(cursor));

            return observableCursor(100)
                .expand(() => observableCursor(100))
                .takeWhile(res => res && res[0] && res[0].length > 0)
                .map(res => res[0])
                .mergeMap(rows => Observable.from(rows))
                .map(toUser)
                .finally(() => client.release());
        })
};

export const findAllUsers = query('select * from users');

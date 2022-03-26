interface DBI<T> {
    add(info: T): boolean

    delete(id: number): boolean

    update(info: T, id: number): boolean

    get(id: number): any
}

class MySql<T> implements DBI<T> {

    //构造方法
    constructor() {

    }
    add(info: T): boolean {

        return false;
    }

    delete(id: number): boolean {
        return false;
    }

    get(id: number): any {

    }


    update(info: T, id: number): boolean {
        return false;
    }


}
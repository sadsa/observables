import fetch from "node-fetch";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/observable/fromPromise';

class DataSource {
  constructor() {
    let i = 0;
    this._id = setInterval(() => this.emit(i++), 1000);
  }
  
  emit(n) {
    const limit = 10;
    if (this.ondata) {
      this.ondata(n);
    }
    if (n === limit) {
      if (this.oncomplete) {
        this.oncomplete();
      }
      this.destroy();
    }
  }
  
  destroy() {
    clearInterval(this._id);
  }
}


/**
 * our observable
 */
function myObservable(observer) {
    let datasource = new DataSource();
    datasource.ondata = (e) => observer.next(e);
    datasource.onerror = (err) => observer.error(err);
    datasource.oncomplete = () => observer.complete();
    return () => {
        datasource.destroy();
    };
}

const repeaterObs = new Observable(myObservable);
repeaterObs.subscribe({
  next: (num) => {
    console.log(num)
  },
  completed: () => {
    console.log('Job done');
  }
});

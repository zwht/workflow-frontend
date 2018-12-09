/**
 * Created by zhaowei on 2018/8/2.
 */
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SessionService {
    private timeRegx = /(([0-9]+)(s|m|h|d|w))/g;
    private getTime(v, type) {
        if (type === 's') {
            return v * 1000;
        } else if (type === 'm') {
            return v * 60000;
        } else if (type === 'h') {
            return v * 3600000;
        } else if (type === 'd') {
            return v * 86400000;
        } else if (type === 'w') {
            return v * 604800000;
        }
    }
    private parseTime(v) {
        let time = 0;
        if (typeof (v) === 'number') {
            time = Math.floor(v);
        } else if (typeof (v) === 'string') {
            v.replace(this.timeRegx, (r, s, value, type) => {
                time += this.getTime(value, type);
                return '';
            });
        }
        return time;
    }

    private deleteStorageValue(name) {
        localStorage.removeItem(name);
        sessionStorage.removeItem(name);
    }

    /**
      * 向session中存储字符串 时间格式支持'seconds minutes hours days weeks',比如 '2 days and 4 hours'
      *
      * @method set
      * @param {String} 键
      * @param {String} 值
      * @param {String} 过期时间
      */
    // 如果没设置时间则将session值保存在sessionStorage
    // 若设置了时间则保存在localstorage中
    public setItem(name1, value1, time1?) {
        const time = this.parseTime(time1),
            name = encodeURIComponent(name1),
            value = encodeURIComponent(value1);
        if (!time) {
            sessionStorage.setItem(name, value);
        } else {
            const expireTime = new Date().getTime() + time;
            localStorage.setItem(name, expireTime + '#%#' + value);
        }
    }

    /**
     * 获取session值
     *
     * @method get
     * @param {String} 键值
     * @return {String} session中存储的字符串
     */
    // 获取storage中找到值，如果设置了过期时间，与当前时间匹配，如果超时返回空，并删除localstorage中的值
    public getItem(name) {
        let value = sessionStorage[name] || localStorage[name];
        if (value && (value + '').indexOf('#%#') > 0) {
            const splits = (value + '').split('#%#');
            const time = splits[0];
            if (Number(time) > new Date().getTime()) {
                value = splits[1];
            } else {
                value = undefined;
                localStorage.removeItem(name);
                sessionStorage.removeItem(name);
            }
        }
        return value && decodeURIComponent(value);
    }

    /**
    * 删除session中存储的值
    *
    * @method remove
    * @param {String} 键值
    */
    public removeItem(name) {
        if (!Array.isArray(name)) {
            name = [name];
        }
        name.forEach(item => {
            this.deleteStorageValue(item);
        });
    }
}

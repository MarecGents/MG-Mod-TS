export class ValueUpdate {

    /**
     * @param data like database/config/bot.json
     * @param index  like ['presetBatch', 'assault'] is shown that you want change the value of bot["presetBatch"]["assault"]
     * or bot.presetBatch.assault
     * @param key like
     * @param value is the value you want change under index
     * @constructor
     */
    public _ValueUpdate(data:any,index:string[],value:any,key?:string[]) {
        const indexStr = index.map(ele => `.${ele}?`).join("")
        eval(`data${indexStr} = value`);
    }

    /**
     *
     * @param data  same as _ValueUpdate()
     * @param index  same as _ValueUpdate()
     * @param value  same as _ValueUpdate()
     * @param key  same as _ValueUpdate()
     */
    public _batchUpdate(data:any,index:string[],value:any,key?:string[]) {
        const indexStr = index.map(ele => `.${ele}?`).join("")
        if(!key){
            eval(`for(let it in data${indexStr}){data${indexStr}[it] = value}`);
        }
        else{
            eval(`for(let it in data${indexStr}){for(let k in key){data${indexStr}[it][k] = value}}`);
        }


    }
}
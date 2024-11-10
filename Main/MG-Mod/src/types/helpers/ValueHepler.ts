export class ValueHepler {

    /**
     * @param data like database/config/bot.json
     * @param index  like ['presetBatch', 'assault'] is shown that you want change the value of bot["presetBatch"]["assault"]
     * or bot.presetBatch.assault. Warning: do not add any "" in index like → ["a","","b"].
     * @param key like you want change the value of bot.presetBatch.assault.{key}
     * @param value is the value you want change under index with key if present
     * @constructor
     */
    public _ValueUpdate(data: any, index: string[], value: any, key?: string) {
        let indexStr = index?.map(ele => `.${ele}`).join("")
        let newIndex = key ? (indexStr + `.${key}`) : indexStr;
        if (!(data && value)) {
            return;
        }
        eval(`data${newIndex} = value;`);
    }

    public _getValue(data: any, index: string[], key?: string) {
        let indexStr = index?.map(ele => `.${ele}`).join("")
        let newIndex = key ? (indexStr + `.${key}`) : indexStr;
        let newData = undefined;
        if (!data) {
            return undefined;
        }
        eval(`newData = data${newIndex};`);
        if (newData) {
            return newData;
        }
        return undefined;
    }
}
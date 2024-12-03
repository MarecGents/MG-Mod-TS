import {IItem} from "@spt/models/eft/common/tables/IItem";

export class IFormatUtils {

    public replaceAll(data:string,Key:string,newKey:string):string{
        // 对searchValue进行转义，以避免正则表达式特殊字符的问题
        const escapedKey = this.escapeRegExp(Key);
        // 构建带有全局标志的正则表达式
        const regex = new RegExp(escapedKey, 'g');
        // 使用replace方法进行替换
        return data.replace(regex, newKey);
    }

    private escapeRegExp(data:string):string {
        // 转义正则表达式中的特殊字符
        return data.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& 表示整个匹配的字符串
    }

    /**
     * this method has something wrong, do not use. written by MarecGents at 2024-12-03_19:00pm
     */
    public assortIdIssue(assorts:IItem[]):boolean {
        let AstStr = JSON.stringify(assorts);
        assorts.forEach(assort =>{
            // 使用全局正则表达式来查找所有匹配项，注意双引号和转义
            const regex = new RegExp(this.escapeRegExp(assort._id), 'g');
            // match 方法返回一个数组，包含所有匹配的结果
            const matches = AstStr.match(regex);
            // 如果 matches 是 null，则表示没有找到任何匹配项
            let count = matches ? matches.length : 0;
            if(count > 3 || count === 0){
                return false;
            }
        })
        return true;
    }

}
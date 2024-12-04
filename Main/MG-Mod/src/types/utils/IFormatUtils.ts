import {IItem} from "@spt/models/eft/common/tables/IItem";
import {Mod} from "../../mod";

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
     * @description this method is aiming to test the assorts content whether if there is repeated assort._id in any place elsewhere
     */
    public assortIdIssue(assortItems:IItem[]):boolean {
        let AstStr = JSON.stringify(assortItems);
        let key = 0;
        assortItems.forEach(assort =>{
            const IdCount = this.repeatContentCount(assort._id,AstStr);
            const parentIdCount = this.repeatContentCount(`"parentId":"${assort._id}"`,AstStr);
            if(IdCount-parentIdCount !== 1){
                key += 1;
            }
        })
        return (key === 0);
    }

    /**
     * @param content which you want to find to count in data
     * @param data  in which the content you want to find to count
     */
    public repeatContentCount(content:string,data:string):number {
        // 使用全局正则表达式来查找所有匹配项，注意双引号和转义
        const regex = new RegExp(this.escapeRegExp(content), 'g');
        // match 方法返回一个数组，包含所有匹配的结果
        const matches = data.match(regex);
        // 如果 matches 是 null，则表示没有找到任何匹配项
        return matches ? matches.length : 0;
    }
}
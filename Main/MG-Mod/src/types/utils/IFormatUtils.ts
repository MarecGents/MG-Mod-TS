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
}
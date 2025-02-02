import {DefaultTime, LongTime} from "../models/common/ITime";

export class ITimeUtils{

    public getDateNow():DefaultTime {
        const date = new Date();
        return {
            Year: date.getFullYear(),
            Month: date.getMonth(),
            Day: date.getDate()
        };
    }

    public getFullDate():LongTime {
        const date = new Date();
        return {
            Year: date.getFullYear(),
            Month: date.getMonth(),
            Day: date.getDate(),
            Hours: date.getHours(),
            Minutes: date.getMinutes(),
            Seconds: date.getSeconds()
        };
    }

    public getDateString(type = "Date"):string {
        if (type !== "Date") {
            const FullDate:LongTime = this.getFullDate();
            return `${FullDate.Year}-${FullDate.Month}-${FullDate.Day} ${FullDate.Hours}:${FullDate.Minutes}:${FullDate.Seconds}`;
        }
        const Date:DefaultTime = this.getDateNow();
        return `${Date.Year}-${Date.Month}-${Date.Day}`;
    }

    public dateDiffence(oldDate:DefaultTime, newDate:DefaultTime):number {
        const date1:Date = new Date(oldDate.Year,oldDate.Month,oldDate.Day);
        const date2:Date = new Date(newDate.Year,newDate.Month,newDate.Day);
        const timeDifference:number = date2.getTime() - date1.getTime();
        return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    }
}
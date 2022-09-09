import chalk, { ChalkInstance } from 'chalk';

type Status = 'positive' | 'negative' | 'neutral';
interface Log {
    status(status: Status, ...data: any[]): void
}

const CHECK = String.fromCharCode(0x2713);
// const X = String.fromCharCode(0x2717);
const X = String.fromCharCode(0x2a2f);
const formatters: Record<Status, [ChalkInstance, string]> = {
    positive: [chalk.greenBright , CHECK],
    neutral:  [chalk.ansi256(250), X],
    negative: [chalk.redBright,    '-']
};
export const log: Log = {
    status(status, ...data) {
        const [ format, symbol ] = formatters[status];
        console.log(format(symbol, ...data));
    }
}
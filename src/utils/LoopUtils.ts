export default class LoopUtils {
	public static mapNTimes<T>(n: number, callback: (n: number) => T): T[] {
		const arr: T[] = [];
		for (let i = 0; i < n; i++) arr.push(callback(i));
		return arr;
	}
}

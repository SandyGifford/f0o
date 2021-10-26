export default class StringUtils {
	public static strIfTruthy(val: any, str: string): string {
		if (val) return str;
		else return "";
	}

	public static strsIfTruthy(strs: [any, string][], joiner = ""): string {
		return strs.map(([val, str]) => StringUtils.strIfTruthy(val, str)).filter(i => !!i).join(joiner);
	}
}

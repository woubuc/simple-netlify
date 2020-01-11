import fs from 'fs-extra';

export async function fileExists(path : string) : Promise<boolean> {
	try {
		let stat = await fs.stat(path);
		return stat.isFile();
	} catch (_) {
		return false;
	}
}

export async function readFile(path : string) : Promise<string | undefined> {
	try {
		let data = await fs.readFile(path);
		return data.toString();
	} catch (_) {
		return undefined;
	}
}

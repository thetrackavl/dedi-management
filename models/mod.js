class Mod {
	modName;
	constructor(modName) {
		if (!modName)
			throw new Error("Required paramater `modName` missing in Mod");
		this.modName = modName;
	}
}

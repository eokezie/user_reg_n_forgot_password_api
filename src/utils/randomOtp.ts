const randomOTP = (n: number) => {
	return Math.floor(Math.random() * (9 * Math.pow(10, n))) + Math.pow(10, n);
};

const generate = (factor: any) => {
	let result = "";
	let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	let charLength = characters.length;
	for (let i = 0; i < factor; i++) {
		result += characters.charAt(Math.floor(Math.random() * charLength));
	}
	return result;
};

export { randomOTP, generate };
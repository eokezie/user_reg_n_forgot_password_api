export const successResponse = (
	message: string,
	responseData: object | null
): object => {
	return {
		success: true,
		message: message,
		data: responseData,
	};
};
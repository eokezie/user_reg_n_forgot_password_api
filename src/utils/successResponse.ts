export const successResponse = (
	responseData: object | null,
    message: string,
): object => {
	return {
		success: true,
		message: message,
		data: responseData,
	};
};
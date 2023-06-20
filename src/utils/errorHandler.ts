import { Request, Response, NextFunction } from "express";

type TErrorType = {
    message: string,
    name: string,
};

const errorHandler = (err: TErrorType, req:Request, res: Response, next: NextFunction) => {
	switch (true) {
		case typeof err === "string":
			const is404 = err.message.toLowerCase().endsWith("not found");
			const statusCode = is404 ? 404 : 400;
			return res.status(statusCode).json({ message: err });
		case err.name === "ValidationError":
			return res.status(400).json({ message: err.message });
		case err.name === "Unauthorized":
			return res.status(401).json({ message: "Unauthorized" });
		case err.message === "Unauthorized":
			return res.status(401).json({ message: "Not Authorized" });
		case err.message.endsWith("not found"):
			return res.status(404).json({ message: err.message });
		default:
			return res.status(500).json({ message: err.message });
	}
};

export { errorHandler };

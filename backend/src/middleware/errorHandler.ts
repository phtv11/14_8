import { Request, Response, NextFunction } from "express";

interface EthersError extends Error {
    code?: string;
    reason?: string;
    data?: unknown;
}

function isEthersCallException(error: any): error is EthersError {
    return (
        error &&
        (error.code === "CALL_EXCEPTION" || error.name === "CallException")
    );
}

function getContractErrorMessage(error: EthersError): string {
    if (error.reason) {
        return error.reason;
    }

    return "Contract execution reverted";
}

function isNotFoundErrorMessage(message: string): boolean {
    const normalized = message.toLowerCase();
    return (
        normalized.includes("nonexistent") ||
        normalized.includes("invalid token") ||
        normalized.includes("not found") ||
        normalized.includes("does not exist") ||
        normalized.includes("token does not exist") ||
        normalized.includes("owner query for nonexistent token")
    );
}

export default function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;
    let message = "Internal server error";

    if (err && typeof err === "object") {
        const maybeError = err as any;

        if (typeof maybeError.statusCode === "number") {
            statusCode = maybeError.statusCode;
            if (typeof maybeError.message === "string") {
                message = maybeError.message;
            }
        } else if (isEthersCallException(maybeError)) {
            message = getContractErrorMessage(maybeError);
            if (isNotFoundErrorMessage(message)) {
                statusCode = 404;
            } else {
                statusCode = 409;
            }
        } else if (maybeError instanceof Error) {
            const errorMessage = maybeError.message;
            if (typeof errorMessage === "string" && errorMessage) {
                message = errorMessage;
            }
        }
    }

    if (statusCode >= 500) {
        message = "Internal server error";
    }

    res.status(statusCode).json({
        success: false,
        message
    });
}

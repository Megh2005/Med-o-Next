export class ApiError {
  success: boolean;
  status: number;
  message: string;

  constructor(status: number, message: string) {
    this.success = false;
    this.status = status;
    this.message = message;
  }
}

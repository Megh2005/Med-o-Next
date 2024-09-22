export class ApiSuccess {
  success: boolean;
  status: number;
  message: string;
  data: any;

  constructor(status: number, message: string, data: any) {
    this.success = true;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

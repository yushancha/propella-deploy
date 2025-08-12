import { NextResponse } from 'next/server';

/**
 * 统一API响应格式
 */
export class ApiResponse {
  /**
   * 成功响应
   */
  static success<T>(data: T, message: string = "操作成功", statusCode: number = 200) {
    return NextResponse.json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    }, { status: statusCode });
  }

  /**
   * 错误响应
   */
  static error(message: string, statusCode: number = 500, details?: any) {
    return NextResponse.json({
      success: false,
      message,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
      timestamp: new Date().toISOString(),
    }, { status: statusCode });
  }

  /**
   * 验证错误响应
   */
  static validation(errors: Record<string, string[]>) {
    return NextResponse.json({
      success: false,
      message: "数据验证失败",
      errors,
      timestamp: new Date().toISOString(),
    }, { status: 400 });
  }

  /**
   * 未授权响应
   */
  static unauthorized(message: string = "未授权访问") {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    }, { status: 401 });
  }

  /**
   * 禁止访问响应
   */
  static forbidden(message: string = "禁止访问") {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    }, { status: 403 });
  }

  /**
   * 资源未找到响应
   */
  static notFound(message: string = "资源未找到") {
    return NextResponse.json({
      success: false,
      message,
      timestamp: new Date().toISOString(),
    }, { status: 404 });
  }
}
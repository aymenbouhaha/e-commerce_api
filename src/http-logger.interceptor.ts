import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    console.log("METHOD :",method);
    console.log("URL :",url)
    console.log('Request body:', request.body);
    console.log("Headers:" ,request.headers)

    return next.handle()
    //   .pipe(
    //   tap(() => {
    //     const response = context.switchToHttp().getResponse();
    //     const statusCode = response.statusCode;
    //     const elapsedTime = Date.now() - now;
    //
    //   }),
    // );
  }
}

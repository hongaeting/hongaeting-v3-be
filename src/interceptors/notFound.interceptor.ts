import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res) => {
        switch (context.switchToHttp().getRequest().method) {
          case 'GET':
            if ((res instanceof Array && res.length === 0) || !res)
              throw new NotFoundException();
            return res;
          case 'PATCH':
          case 'DELETE':
            if (res.affected === 0) {
              throw new NotFoundException();
            }
            break;
          default:
            break;
        }
        return true;
      }),
    );
  }
}

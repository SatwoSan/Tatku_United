import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PersistenceInterceptor implements NestInterceptor {
  constructor(private readonly databaseService: DatabaseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;

    return next.handle().pipe(
      tap(() => {
        // After any successful state-mutating request, save the current memory state to Supabase.
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          // We call it without awaiting so we don't delay the HTTP response
          this.databaseService.save().catch((err) => {
             console.error('PersistenceInterceptor failed to save:', err);
          });
        }
      }),
    );
  }
}

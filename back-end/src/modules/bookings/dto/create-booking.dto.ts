import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    description: 'Optional notes for the booking',
    required: false,
    example: 'Please bring extra cleaning supplies',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

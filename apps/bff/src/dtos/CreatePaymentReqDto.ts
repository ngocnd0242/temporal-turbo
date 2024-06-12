import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentReqDto {
  id: string;
  @ApiProperty({
    example: 'order-KndNorzqc0rdTTGbqy6Be',
    description: 'Workflow order id',
  })
  orderId: string;

  @ApiProperty({
    example: '28.99',
    description: 'Price',
  })
  price: number;

  @ApiProperty({
    example: 'false',
    description: 'Status',
  })
  failed: boolean;
}

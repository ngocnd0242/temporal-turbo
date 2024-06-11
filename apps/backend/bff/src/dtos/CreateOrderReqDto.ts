import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderReqDto {
  id: string;
  @ApiProperty({
    example: '11.99',
    description: 'Price',
  })
  price: number;

  @ApiProperty({
    example: 'P1111',
    description: 'Product ID',
  })
  productId: number;
}

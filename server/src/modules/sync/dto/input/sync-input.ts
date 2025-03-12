import { Field, InputType } from '@nestjs/graphql';
import { DateTimeScalar } from 'src/common/graphql/datetime.scalar';
import { UUIDScalar } from 'src/common/graphql/uuid.scalar';

@InputType()
class CardInput {
  @Field(() => UUIDScalar)
  _id: string;

  @Field()
  front: string;

  @Field()
  back: string;

  @Field()
  deckId: string;

  @Field()
  starred: boolean;

  @Field()
  isDelete: boolean;

  @Field()
  version: number;

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;
}

@InputType()
class DeckInput {
  @Field(() => UUIDScalar)
  _id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  isDelete: boolean;

  @Field()
  version: number;

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;
}

@InputType()
export class SyncInput {
  @Field(() => Number)
  version: number;
  //Sync sẽ được gọi khi nào ? Đăng nhập, đăng xuất hoặc là bấm nút sync
  //Version trên db sẽ lấy version của input này để lưu
  //Nếu null thì trả full về
  //Nếu version phía dưới lớn hơn thì cập nhật cho db trên và ngược lại
  //Nếu cùng phiên bản thì lấy từng phiên bản của decks/ cards để so sánh tương tự là so sánh theo từng cặp (input vs db) thằng nào phiên bản lớn hơn thì lấy bằng nhau thì so sánh updatedAt
  //Khi so sánh updatedAt thì thằng nào trễ hơn thì lấy thằng đó (nếu isDelete là true thì xoá luôn)

  @Field(() => [CardInput], { nullable: true })
  cards?: CardInput[];

  @Field(() => [DeckInput], { nullable: true })
  decks?: DeckInput[];
}

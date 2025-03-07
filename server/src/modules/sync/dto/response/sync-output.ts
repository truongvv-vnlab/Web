import { Field, ObjectType } from '@nestjs/graphql';
import { DateTimeScalar } from 'src/common/graphql/datetime.scalar';
import { UUIDScalar } from 'src/common/graphql/uuid.scalar';

@ObjectType()
class CardOutPut {
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
  version: number;

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;
}

@ObjectType()
class DeckOutput {
  @Field(() => UUIDScalar)
  _id: string;

  @Field()
  name: string;

  @Field()
  decription: string;

  @Field()
  userId: string;

  @Field()
  starred: boolean;

  @Field()
  version: number;

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;
}

@ObjectType()
export class SyncInput {
  @Field()
  version: number | null;
  //Sync sẽ được gọi khi nào ? Đăng nhập, đăng xuất hoặc là bấm nút sync
  //Version trên db sẽ lấy version của input này để lưu
  //Nếu null thì trả full về
  //Nếu version phía dưới lớn hơn thì cập nhật cho db trên và ngược lại
  //Nếu cùng phiên bản thì lấy từng phiên bản của decks/ cards để so sánh tương tự là so sánh theo từng cặp (input vs db) thằng nào phiên bản lớn hơn thì lấy bằng nhau thì so sánh updatedAt

  @Field(() => CardOutPut)
  cards?: CardOutPut[];

  @Field(() => DeckOutput)
  decks?: DeckOutput[];
}

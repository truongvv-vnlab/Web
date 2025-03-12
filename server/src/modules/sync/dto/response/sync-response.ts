import { Field, ObjectType } from '@nestjs/graphql';
import { DeleteType } from 'src/common/enum/deleteType';
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
  description: string;

  @Field()
  version: number;

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;
}

@ObjectType()
class DeleteLogOutput {
  @Field()
  type: DeleteType;

  @Field()
  targetId: string;

  @Field()
  version: number;
}

@ObjectType()
export class SyncResp {
  @Field(() => Number)
  version: number;
  //Sync sẽ được gọi khi nào ? Đăng nhập, đăng xuất hoặc là bấm nút sync
  //Version trên db sẽ lấy version của input này để lưu
  //Nếu null thì trả full về
  //Nếu version phía dưới lớn hơn thì cập nhật cho db trên và ngược lại
  //Nếu cùng phiên bản thì lấy từng phiên bản của decks/ cards để so sánh tương tự là so sánh theo từng cặp (input vs db) thằng nào phiên bản lớn hơn thì lấy bằng nhau thì so sánh updatedAt

  @Field(() => [CardOutPut], { nullable: true })
  cards?: CardOutPut[];

  @Field(() => [DeckOutput], { nullable: true })
  decks?: DeckOutput[];

  @Field(() => [DeleteLogOutput], { nullable: true })
  deleteLogs?: DeleteLogOutput[];
}
